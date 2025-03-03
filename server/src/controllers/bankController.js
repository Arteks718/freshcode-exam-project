const { format } = require('date-fns');
const db = require('../db/models/index');
const { v4: uuid } = require('uuid');
const bankQueries = require('./queries/bankQueries');
const userQueries = require('./queries/userQueries');
const CONSTANTS = require('../constants');

module.exports.payment = async (req, res, next) => {
  let transaction;
  const {
    body: { number, expiry, cvc, contests, price },
    tokenData: { userId },
  } = req;

  try {
    const cardNumber = number.replace(/ /g, '');
    transaction = await db.sequelize.transaction();
    await bankQueries.updateBankBalance(
      {
        balance: db.sequelize.literal(`
          CASE
            WHEN 
              "cardNumber"='${cardNumber}' 
              AND "cvc"='${cvc}' 
              AND "expiry"='${expiry}'
            THEN "balance"-${price}
            WHEN 
              "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' 
              AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}' 
              AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}'
            THEN "balance"+${price} 
          END
        `),
      },
      {
        cardNumber: {
          [db.Sequelize.Op.in]: [CONSTANTS.SQUADHELP_BANK_NUMBER, cardNumber],
        },
      },
      transaction
    );
    const orderId = uuid();
    const updatedContests = contests.map((contest, index) => {
      const prize =
        index === contests.length - 1
          ? Math.ceil(price / contests.length)
          : Math.floor(price / contests.length);
      return {
        ...contest,
        status:
          index === 0
            ? CONSTANTS.CONTEST_STATUS_ACTIVE
            : CONSTANTS.CONTEST_STATUS_PENDING,
        userId,
        priority: index + 1,
        orderId,
        prize,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
      };
    });
    await db.Contests.bulkCreate(updatedContests, transaction);
    transaction.commit();
    res.send();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  const {
    body: { sum, number, expiry },
    tokenData: { userId },
  } = req;
  let transaction;

  try {
    const cardNumber = number.replace(/ /g, '');
    transaction = await db.sequelize.transaction();

    const updatedUser = await userQueries.updateUser(
      { balance: db.sequelize.literal('balance - ' + sum) },
      userId,
      transaction
    );
    await bankQueries.updateBankBalance(
      {
        balance: db.sequelize.literal(`
          CASE 
            WHEN 
              "cardNumber"='${cardNumber}' 
              AND "expiry"='${expiry}' AND "cvc"='${cvc}'
            THEN "balance"+${sum}
            WHEN 
              "cardNumber"='${CONSTANTS.SQUADHELP_BANK_NUMBER}' 
              AND "expiry"='${CONSTANTS.SQUADHELP_BANK_EXPIRY}' 
              AND "cvc"='${CONSTANTS.SQUADHELP_BANK_CVC}'
            THEN "balance"-${sum}
          END
        `),
      },
      {
        cardNumber: {
          [db.Sequelize.Op.in]: [CONSTANTS.SQUADHELP_BANK_NUMBER, cardNumber],
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
