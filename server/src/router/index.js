const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const offerController = require('../controllers/offerController')
const bankController = require('../controllers/bankController');
const ratingController = require('../controllers/ratingController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const chatController = require('../controllers/chatController');
const upload = require('../utils/fileUpload');
const router = express.Router();
const contestRouter = require('./contestRouter');

router.use('/contests', contestRouter);

router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration,
);

router.post(
  '/login',
  validators.validateLogin,
  userController.login,
);

router.post(
  '/pay',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  bankController.payment,
);

router.post(
  '/getUser',
  checkToken.checkAuth,
);

router.post(
  '/setNewOffer',
  checkToken.checkToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  offerController.setNewOffer,
);

router.post(
  '/setOfferStatus',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomerWhoCreatedContest,
  offerController.setOfferStatus,
);

router.post(
  '/changeMark',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  ratingController.changeRatingMark,
);

router.post(
  '/updateUser',
  checkToken.checkToken,
  upload.uploadAvatar,
  userController.updateUser,
);

router.post(
  '/cashout',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  bankController.cashout,
);

router.post(
  '/newMessage',
  checkToken.checkToken,
  chatController.addMessage,
);

router.post(
  '/getChat',
  checkToken.checkToken,
  chatController.getChat,
);

router.post(
  '/getPreview',
  checkToken.checkToken,
  chatController.getPreview,
);

router.post(
  '/blackList',
  checkToken.checkToken,
  chatController.blackList,
);

router.post(
  '/favorite',
  checkToken.checkToken,
  chatController.favoriteChat,
);

router.post(
  '/createCatalog',
  checkToken.checkToken,
  chatController.createCatalog,
);

router.post(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatController.updateNameCatalog,
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatController.addNewChatToCatalog,
);

router.post(
  '/removeChatFromCatalog',
  checkToken.checkToken,
  chatController.removeChatFromCatalog,
);

router.post(
  '/deleteCatalog',
  checkToken.checkToken,
  chatController.deleteCatalog,
);

router.post(
  '/getCatalogs',
  checkToken.checkToken,
  chatController.getCatalogs,
);

router.get(
  '/getOffers',
  checkToken.checkToken,
  offerController.getOffers
)

router.put(
  '/updateOffer',
  checkToken.checkToken,
  offerController.updateOffer
)

module.exports = router;
