const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const db = require('../db/models');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.login = async (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  try {
    const foundUser = await userQueries.findUser({ email });
    const { id: userId, ...userWithoutId } = foundUser;

    await userQueries.passwordCompare(password, foundUser.password);
    const accessToken = jwt.sign(
      {
        ...userWithoutId,
        userId,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );
    await userQueries.updateUser({ accessToken }, userId);

    res.send({ token: accessToken });
  } catch (err) {
    next(err);
  }
};
module.exports.registration = async (req, res, next) => {
  const { hashPass, body } = req;

  try {
    const newUser = await userQueries.userCreation({
      ...body,
      password: hashPass,
    });
    const { id: userId, ...userWithoutId } = newUser;

    const accessToken = jwt.sign(
      {
        ...userWithoutId,
        userId,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );
    await userQueries.updateUser({ accessToken }, userId);

    res.send({ token: accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const {
    file,
    body,
    tokenData: { userId },
  } = req;

  try {
    if (file) {
      body.avatar = file.filename;
    }
    const updatedUser = await userQueries.updateUser(body, userId);
    res.send({
      ...updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

/////////////////////////  PAYMENT  ///////////////////////////

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    await bankQueries.updateBankBalance(
      {
        balance: db.sequelize.literal(`
                CASE
            WHEN "cardNumber"='${req.body.number.replace(
              / /g,
              ''
            )}' AND "cvc"='${req.body.cvc}' AND "expiry"='${req.body.expiry}'
                THEN "balance"-${req.body.price}
            WHEN "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' AND "cvc"='${
          CONSTANTS.SQUADHELP_BANK_CVC
        }' AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}'
                THEN "balance"+${req.body.price} END
        `),
      },
      {
        cardNumber: {
          [db.Sequelize.Op.in]: [
            CONSTANTS.SQUADHELP_BANK_NUMBER,
            req.body.number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );
    const orderId = uuid();
    req.body.contests.forEach((contest, index) => {
      const prize =
        index === req.body.contests.length - 1
          ? Math.ceil(req.body.price / req.body.contests.length)
          : Math.floor(req.body.price / req.body.contests.length);
      contest = Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId: req.tokenData.userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });
    });
    await db.Contests.bulkCreate(req.body.contests, transaction);
    transaction.commit();
    res.send();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const updatedUser = await userQueries.updateUser(
      { balance: db.sequelize.literal('balance - ' + req.body.sum) },
      req.tokenData.userId,
      transaction
    );
    await bankQueries.updateBankBalance(
      {
        balance: db.sequelize.literal(`CASE 
                WHEN "cardNumber"='${req.body.number.replace(
                  / /g,
                  ''
                )}' AND "expiry"='${req.body.expiry}' AND "cvc"='${
          req.body.cvc
        }'
                    THEN "balance"+${req.body.sum}
                WHEN "cardNumber"='${
                  CONSTANTS.SQUADHELP_BANK_NUMBER
                }' AND "expiry"='${
          CONSTANTS.SQUADHELP_BANK_EXPIRY
        }' AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}'
                    THEN "balance"-${req.body.sum}
                 END
                `),
      },
      {
        cardNumber: {
          [db.Sequelize.Op.in]: [
            CONSTANTS.SQUADHELP_BANK_NUMBER,
            req.body.number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );
    transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

/////////////////////////  RATING  ///////////////////////////

function getRatingQuery(offerId, userId, mark, isFirst, transaction) {
  if (isFirst) {
    return ratingQueries.createRating(
      {
        offerId,
        mark,
        userId,
      },
      transaction
    );
  } else {
    return ratingQueries.updateRating(
      { mark },
      { offerId, userId },
      transaction
    );
  }
}

module.exports.changeRatingMark = async (req, res, next) => {
  let transaction;
  const {
    body: { isFirst, offerId, mark, creatorId },
    tokenData: { userId },
  } = req;

  try {
    transaction = await db.sequelize.transaction({
      isolationLevel:
        db.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });

    await getRatingQuery(offerId, userId, mark, isFirst, transaction);

    const offersArray = await db.Ratings.findAll({
      include: [
        {
          model: db.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ],
      raw: true,
      transaction,
    });

    const sum = offersArray.reduce((acc, offer) => acc + offer.mark, 0);
    const avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};
