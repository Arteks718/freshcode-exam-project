const db = require('../db/models');
const ratingQueries = require('../controllers/queries/ratingQueries');
const CONSTANTS = require('../constants');

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo',
];

function getPredicateTypes(index) {
  return { [db.Sequelize.Op.or]: [types[index].split(',')] };
}

module.exports.createWhereForAllContests = (
  typeIndex,
  contestId,
  industry,
  awardSort
) => {
  const where = {};
  const order = [];

  if (typeIndex) {
    where.contestType = getPredicateTypes(typeIndex);
  }
  if (contestId) {
    where.id = contestId;
  }
  if (industry) {
    where.industry = industry;
  }
  if (awardSort) {
    order.push(['prize', awardSort]);
  }

  where.status = {
    [db.Sequelize.Op.or]: [
      CONSTANTS.CONTEST_STATUS_FINISHED,
      CONSTANTS.CONTEST_STATUS_ACTIVE,
    ],
  };

  order.push(['id', 'desc']);

  return { where, order };
};

module.exports.getRatingQuery = (
  offerId,
  userId,
  mark,
  isFirst,
  transaction
) => {
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
};
