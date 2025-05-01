const db = require('../db/models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

const setCountForContests = (contests) => {
  contests.forEach((contest) => {
    contest.count = contest.Offers ? contest.Offers.length : 0;
  });
};

module.exports.dataForContest = async (req, res, next) => {
  const response = {};
  try {
    const {
      query: { characteristic1, characteristic2 },
    } = req;

    const types = [characteristic1, characteristic2, 'industry'].filter(
      Boolean
    );

    const characteristics = await db.Selects.findAll({
      where: {
        type: {
          [db.Sequelize.Op.or]: types,
        },
      },
    });
    if (!characteristics) {
      return next(new ServerError('cannot get charactetistics'));
    }
    characteristics.forEach((characteristic) => {
      if (!response[characteristic.type]) {
        response[characteristic.type] = [];
      }
      response[characteristic.type].push(characteristic.describe);
    });
    res.send(response);
  } catch (err) {
    next(new ServerError('cannot get contest preferences'));
  }
};

module.exports.getContestById = async (req, res, next) => {
  const {
    params: { id: contestId },
    tokenData: { userId, role },
  } = req;

  try {
    let contestInfo = await db.Contests.findOne({
      where: { id: contestId },
      order: [
        [
          db.Sequelize.literal(
            `CASE "Offers"."status"
            WHEN '${CONSTANTS.OFFER_STATUS_WON}' THEN 1
            WHEN '${CONSTANTS.OFFER_STATUS_APPROVED}' THEN 2
            WHEN '${CONSTANTS.OFFER_STATUS_REVIEW}' THEN 3
            WHEN '${CONSTANTS.OFFER_STATUS_DECLINED}' THEN 4
            WHEN '${CONSTANTS.OFFER_STATUS_REJECTED}' THEN 5
            ELSE 6
            END`
          ),
          'ASC',
        ],
        [db.Offers, 'id', 'asc'],
      ],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: {
            exclude: ['password', 'role', 'balance', 'accessToken'],
          },
        },
        {
          model: db.Offers,
          required: false,
          where: role === CONSTANTS.CREATOR ? { userId } : {},
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: {
                exclude: ['password', 'role', 'balance', 'accessToken'],
              },
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });

    if (!contestInfo) {
      return next(new ServerError('Contest not found'));
    }

    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach((offer) => {
      if (offer.Rating) {
        offer.mark = offer.Rating.mark;
      }
      delete offer.Rating;
    });

    const onReviewOffersCount = await db.Offers.count({
      where: {
        contestId,
        status: CONSTANTS.OFFER_STATUS_REVIEW,
      },
    });
    const rejectedOffersCount = await db.Offers.count({
      where: {
        contestId,
        status: CONSTANTS.OFFER_STATUS_REJECTED,
      },
    });
    contestInfo.onReviewCount = onReviewOffersCount;
    contestInfo.rejectedCount = rejectedOffersCount;

    res.send(contestInfo);
  } catch (err) {
    next(new ServerError('cannot get contest by id'));
  }
};

module.exports.downloadFile = async (req, res, next) => {
  try {
    const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
    res.download(file);
  } catch (error) {
    next(new ServerError('cannot download file'));
  }
};

module.exports.updateContest = async (req, res, next) => {
  const {
    file,
    body,
    tokenData: { userId },
  } = req;

  if (file) {
    body.fileName = file.filename;
    body.originalFileName = file.originalname;
  }
  const contestId = body.contestId;
  delete body.contestId;

  try {
    const updatedContest = await contestQueries.updateContest(body, {
      id: contestId,
      userId,
    });

    res.send(updatedContest);
  } catch (err) {
    // throw err from query
    next(err);
  }
};

module.exports.getCustomersContests = async(req, res, next) => {
  try {
    const {
      tokenData: { userId },
      query: { limit, offset, status },
    } = req;

    const contests = await db.Contests.findAll({
      where: { status, userId },
      limit,
      offset: offset ?? 0,
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Offers,
          required: false,
          attributes: ['id'],
        },
      ],
    });

    setCountForContests(contests);
    const haveMore = contests.length > 0;
    res.send({ contests, haveMore });
  } catch (err) {
    console.log(err);
    next(new ServerError('cannot get contests'));
  }
};

module.exports.getCreativeContests = async (req, res, next) => {
  try {
    const {
      query: {
        typeIndex,
        contestId,
        industry,
        awardSort,
        limit,
        offset,
        ownEntries,
      },
      tokenData: { userId },
    } = req;

    const predicates = UtilFunctions.createWhereForCreativeContests(
      typeIndex,
      contestId,
      industry,
      awardSort
    );
    const contests = await db.Contests.findAll({
      where: predicates.where,
      order: predicates.order,
      limit,
      offset: offset ?? 0,
      include: [
        {
          model: db.Offers,
          required: ownEntries,
          where: ownEntries ? { userId } : {},
          attributes: ['id'],
        },
      ],
    })
    setCountForContests(contests);
    const haveMore = contests.length > 0;
    res.send({ contests, haveMore });
  } catch (err) {
    next(new ServerError('cannot get contests'));
  }
};
