const db = require("../db/models")

module.exports.getAllOffers = async (req, res, next) => {
  try {
    const offers = await db.Offers.findAll({
      include: [
        {
          model: db.Contests,
          where: {
            status: 'active',
          },
        },
        {
          model: db.Users,
          attributes: ['rating']
        }
      ],
      order: [['id', 'DESC']],
    });
    
    res.send(offers)
  } catch (e) {
    next(e)
  }
}

module.exports.updateOffer = async (req, res, next) => {
  const { body: status, offerId } = req;
  try {
    const updatedOffer = db.Offers.update({
      status
    }, {
      where: {
        id: offerId
      },
      raw: true,
      returning: true
    })

    res.send(updatedOffer)
  } catch (e) {
    next(e)
  }
}