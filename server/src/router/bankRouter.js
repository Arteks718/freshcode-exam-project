const express = require('express');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const bankController = require('../controllers/bankController');
const bankRouter = express.Router();

bankRouter.use(checkToken.checkToken)

bankRouter.post(
  '/pay',
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  bankController.payment,
);

bankRouter.post(
  '/cashout',
  basicMiddlewares.onlyForCreative,
  bankController.cashout,
);

module.exports = bankRouter;