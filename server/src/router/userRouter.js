const express = require('express');

const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const upload = require('../utils/fileUpload');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const ratingController = require('../controllers/ratingController');
const userRouter = express.Router();

userRouter
  .route('/')
  .get(checkToken.checkAuth)
  .patch(checkToken.checkToken, upload.uploadAvatar, userController.updateUser);

userRouter.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

userRouter.post('/login', validators.validateLogin, userController.login);

userRouter.patch(
  '/changeRatingMark',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  ratingController.changeRatingMark,
);

module.exports = userRouter;
