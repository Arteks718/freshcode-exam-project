const db = require("../db/models");
const userQueries = require("./queries/userQueries");
const { getRatingQuery } = require("../utils/functions");
const controller = require("../socketInit");

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
