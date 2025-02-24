const db = require('../db/models');
const CONSTANTS = require('../constants');
const userQueries = require('../controllers/queries/userQueries')
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const controller = require('../socketInit');
const { sendOfferMessage } = require('../utils/mailer');

module.exports.getAllOffers = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10);
  const offset = parseInt(req.query.offset, 10);

  await db.Offers.findAll({
    include: [
      {
        model: db.Contests,
        where: {
          status: CONSTANTS.CONTEST_STATUS_ACTIVE,
        },
        attributes: [
          'contestType',
          'typeOfName',
          'industry',
          'styleName',
          'typeOfTagline',
          'brandStyle',
        ],
      },
      {
        model: db.Users,
        attributes: ['rating'],
      },
    ],
    where: {
      status: CONSTANTS.OFFER_STATUS_REVIEW,
    },
    order: [['id', 'DESC']],
    limit: limit + 1,
    offset: offset || 0
  })
    .then((offers) => {
      let haveMore = true;
      if (offers.length < limit) {
        haveMore = false;
      }
      res.send({ offers, haveMore });
    })
    .catch((err) => next(err));
};

module.exports.updateOffer = async (req, res, next) => {
  const { status, offerId, message } = req.body;
  try {
    const [updatedCount, updatedOffer] = await db.Offers.update(
      {
        status,
      },
      {
        where: {
          id: offerId,
        },
        raw: true,
        returning: true,
      }
    );
    
    const { User: { firstName, email }, Contest: { title } } = await db.Offers.findOne({
      where: {
        id: offerId
      },
      attributes: ['status', ],
      include: [
        {
          model: db.Users,
          attributes: ['firstName', 'email']
        },
        {
          model: db.Contests,
          attributes: ['title']
        }
      ],
      raw: true,
      nest: true
    })

    sendOfferMessage(email, firstName, status, message, title);
    res.send(updatedOffer[0]);
  } catch (e) {
    next(e);
  }
};

module.exports.setNewOffer = async (req, res, next) => {
  const {
    body: { contestId, contestType, customerId, offerData },
    tokenData: { userId },
    tokenData,
    file,
  } = req;

  const obj = {};
  if (contestType === CONSTANTS.LOGO_CONTEST) {
    obj.fileName = file.filename;
    obj.originalFileName = file.originalname;
  } else {
    obj.text = offerData;
  }
  obj.userId = userId;
  obj.contestId = contestId;
  try {
    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    controller.getNotificationController().emitEntryCreated(customerId);
    const User = Object.assign({}, tokenData, { id: userId });
    res.send(Object.assign({}, result, { User }));
  } catch (e) {
    console.log(e);
    return next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer(
    { status: CONSTANTS.OFFER_STATUS_REJECTED },
    { id: offerId }
  );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      creatorId,
      'Someone of yours offers was rejected',
      contestId
    );
  return rejectedOffer;
};

const resolveOffer = async (
  contestId,
  creatorId,
  orderId,
  offerId,
  priority,
  transaction
) => {
  const finishedContest = await contestQueries.updateContestStatus(
    {
      status: db.sequelize.literal(`   CASE
            WHEN "id"=${contestId}  AND "orderId"='${orderId}' THEN '${
        CONSTANTS.CONTEST_STATUS_FINISHED
      }'
            WHEN "orderId"='${orderId}' AND "priority"=${priority + 1}  THEN '${
        CONSTANTS.CONTEST_STATUS_ACTIVE
      }'
            ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}'
            END
    `),
    },
    { orderId },
    transaction
  );
  await userQueries.updateUser(
    { balance: db.sequelize.literal('balance + ' + finishedContest.prize) },
    creatorId,
    transaction
  );
  const updatedOffers = await contestQueries.updateOfferStatus(
    {
      status: db.sequelize.literal(` CASE
            WHEN "id"=${offerId} THEN '${CONSTANTS.OFFER_STATUS_WON}'::"enum_Offers_status"
            ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}'::"enum_Offers_status"
            END
    `),
    },
    {
      contestId,
    },
    transaction
  );
  transaction.commit();
  const arrayRoomsId = [];
  updatedOffers.forEach((offer) => {
    if (
      offer.status === CONSTANTS.OFFER_STATUS_REJECTED &&
      creatorId !== offer.userId
    ) {
      arrayRoomsId.push(offer.userId);
    }
  });
  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      arrayRoomsId,
      'Someone of yours offers was rejected',
      contestId
    );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);

  updatedOffers.sort((a, b) => {
    if (a.status === CONSTANTS.OFFER_STATUS_WON) return -1;
    if (b.status === CONSTANTS.OFFER_STATUS_WON) return 1;
    return 0;
  });

  return updatedOffers[0].dataValues;
};

module.exports.setOfferStatus = async (req, res, next) => {
  const {
    body: { command, offerId, creatorId, contestId, orderId, priority },
  } = req;

  let transaction;
  if (command === 'reject') {
    try {
      const offer = await rejectOffer(offerId, creatorId, contestId);
      res.send(offer);
    } catch (err) {
      next(err);
    }
  } else if (command === 'resolve') {
    try {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(
        contestId,
        creatorId,
        orderId,
        offerId,
        priority,
        transaction
      );
      res.send(winningOffer);
    } catch (err) {
      transaction.rollback();
      next(err);
    }
  }
};
