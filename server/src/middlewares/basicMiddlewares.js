const db = require('../db/models');
const RightsError = require('../errors/RightsError');
const ServerError = require('../errors/ServerError');
const CONSTANTS = require('../constants');

module.exports.parseBody = (req, res, next) => {
  try {
    const contests = JSON.parse(req.body.contests);
    
    req.body.contests = contests.map((contest) => {
      if (contest.haveFile && Array.isArray(req.files) && req.files.length > 0) {
        const file = req.files.shift();
        return {
          ...contest,
          fileName: file.filename,
          originalFileName: file.originalname,
        };
      }
      return contest;
    });
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.canGetContest = async (req, res, next) => {
  const {
    tokenData: { role, userId },
    params: { id: contestId },
  } = req;
  let result = null;

  try {
    if (role === CONSTANTS.CUSTOMER) {
      result = await db.Contests.findOne({
        where: { id: contestId, userId },
      });
    } else if (role === CONSTANTS.CREATOR) {
      result = await db.Contests.findOne({
        where: {
          id: contestId,
          status: {
            [db.Sequelize.Op.or]: [
              CONSTANTS.CONTEST_STATUS_ACTIVE,
              CONSTANTS.CONTEST_STATUS_FINISHED,
            ],
          },
        },
      });
    }
    result ? next() : next(new RightsError());
  } catch (e) {
    next(new ServerError(e));
  }
};

module.exports.onlyForModerator = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.MODERATOR) {
    next(new RightsError('this page only for moderators'));
  } else {
    next();
  }
};

module.exports.onlyForCreative = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    next(new RightsError('this page only for creatives'));
  } else {
    next();
  }
};

module.exports.onlyForCustomer = (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CREATOR) {
    return next(new RightsError('this page only for customers'));
  } else {
    next();
  }
};

module.exports.canSendOffer = async (req, res, next) => {
  if (req.tokenData.role === CONSTANTS.CUSTOMER) {
    return next(new RightsError('only for creatives'));
  }
  try {
    const result = await db.Contests.findOne({
      where: {
        id: req.body.contestId,
      },
      attributes: ['status'],
    });
    if (
      result.get({ plain: true }).status === CONSTANTS.CONTEST_STATUS_ACTIVE
    ) {
      next();
    } else {
      return next(new RightsError());
    }
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.onlyForCustomerWhoCreatedContest = async (req, res, next) => {
  try {
    const result = await db.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: CONSTANTS.CONTEST_STATUS_ACTIVE,
      },
    });
    if (!result) {
      return next(new RightsError('only for customer who created contest'));
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.canUpdateContest = async (req, res, next) => {
  try {
    const result = db.Contests.findOne({
      where: {
        userId: req.tokenData.userId,
        id: req.body.contestId,
        status: { [db.Sequelize.Op.not]: CONSTANTS.CONTEST_STATUS_FINISHED },
      },
    });
    if (!result) {
      return next(new RightsError());
    }
    next();
  } catch (e) {
    next(new ServerError());
  }
};
