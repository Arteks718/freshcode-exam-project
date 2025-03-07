const express = require('express');

const offerRouter = express.Router();
const offerController = require('../controllers/offerController');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');

offerRouter.use(checkToken.checkToken);

offerRouter
  .route('/')
  .get(offerController.getOffers)
  .post(
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    offerController.setNewOffer
  );

offerRouter
  .route('/:offerId')
  .post(
    basicMiddlewares.onlyForCustomerWhoCreatedContest,
    offerController.setOfferStatus
  )
  .put(offerController.updateOffer);

module.exports = offerRouter;
