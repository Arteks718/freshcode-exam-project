const CONSTANTS = require('../../constants');
const db = require('../../db/models');
const ServerError = require('../../errors/ServerError');

module.exports.getModeratedOffers = async (limit, offset) => {
  const offers = await db.Offers.findAll({
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
    offset: offset || 0,
  });

  return offers;
};

module.exports.updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, updatedOffers] = await db.Offers.update(data, {
    where: predicate,
    returning: true,
    raw: true,
    transaction,
  });
  if (updatedCount !== 1 || updatedCount < 1) {
    throw new ServerError('cannot update offer!');
  } else {
    return updatedOffers;
  }
};

module.exports.createOffer = async (data) => {
  const result = await db.Offers.create(data);
  if (!result) {
    throw new ServerError('cannot create new Offer');
  } else {
    return result.get({ plain: true });
  }
};
