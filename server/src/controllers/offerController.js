const db = require('../db/models');
const CONSTANTS = require('../constants');
const userQueries = require('./queries/userQueries');
const contestQueries = require('./queries/contestQueries');
const offerQueries = require('./queries/offerQueries');
const ServerError = require('../errors/ServerError');
const controller = require('../socketInit');
const { sendOfferMessage } = require('../utils/mailer');

module.exports.getOffers = async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10);
  const offset = parseInt(req.query.offset, 10);

  try {
    const offers = await offerQueries.getModeratedOffers(limit, offset);
    const haveMore = offers.length >= limit;
    res.send({ offers, haveMore });
  } catch (e) {
    next(new ServerError('cannot get offers'));
  }
};

module.exports.updateOffer = async (req, res, next) => {
  const {
    body: { status, message },
    params: { offerId },
  } = req;
  try {
    const [updatedOffer] = await offerQueries.updateOffer(
      { status },
      { id: offerId }
    );

    const {
      User: { firstName, email },
      Contest: { title },
    } = await db.Offers.findOne({
      where: {
        id: offerId,
      },
      attributes: ['status'],
      include: [
        {
          model: db.Users,
          attributes: ['firstName', 'email'],
        },
        {
          model: db.Contests,
          attributes: ['title'],
        },
      ],
      raw: true,
      nest: true,
    });

    sendOfferMessage(email, firstName, status, message, title);
    res.send(updatedOffer);
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

  const obj = {
    userId,
    contestId,
    ...(contestType === CONSTANTS.LOGO_CONTEST
      ? { fileName: file.filename, originalFileName: file.originalname }
      : { text: offerData }),
  };

  try {
    const result = await offerQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    controller.getNotificationController().emitEntryCreated(customerId);
    const User = { ...tokenData, id: userId };
    res.send({ ...result, User });
  } catch (e) {
    next(new ServerError('cannot create new offer'));
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const [rejectedOffer] = await offerQueries.updateOffer(
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

  const updatedOffers = await offerQueries.updateOffer(
    {
      status: db.sequelize.literal(` 
        CASE
          WHEN "id"=${offerId} 
            THEN '${CONSTANTS.OFFER_STATUS_WON}'::"enum_Offers_status"
          WHEN "status"!='${CONSTANTS.OFFER_STATUS_REJECTED}'::"enum_Offers_status"
            THEN '${CONSTANTS.OFFER_STATUS_DECLINED}'::"enum_Offers_status"
          ELSE "status"
        END
    `),
    },
    {
      contestId,
    },
    transaction
  );
  transaction.commit();

  const arrayRoomsId = updatedOffers
    .filter(
      (offer) =>
        offer.status === CONSTANTS.OFFER_STATUS_REJECTED &&
        creatorId !== offer.userId
    )
    .map((offer) => offer.userId);

  if (arrayRoomsId.length > 0) {
    controller
      .getNotificationController()
      .emitChangeOfferStatus(
        arrayRoomsId,
        'Someone of yours offers was rejected',
        contestId
      );
  }
  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);

  updatedOffers.sort((a, b) => {
    if (a.status === CONSTANTS.OFFER_STATUS_WON) return -1;
    if (b.status === CONSTANTS.OFFER_STATUS_WON) return 1;
    return 0;
  });

  return updatedOffers[0];
};

module.exports.setOfferStatus = async (req, res, next) => {
  const {
    body: { command, creatorId, contestId, orderId, priority },
    params: { offerId },
  } = req;

  let transaction;
  if (command === CONSTANTS.OFFER_STATUS_REJECTED) {
    try {
      const offer = await rejectOffer(offerId, creatorId, contestId);
      res.send(offer);
    } catch (err) {
      next(new ServerError('cannot reject offer'));
    }
  } else if (command === CONSTANTS.OFFER_STATUS_WON) {
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
      if (transaction) await transaction.rollback();
      console.log(err);
      next(new ServerError('cannot resolve offer'));
    }
  }
};
