const express = require('express');
const contestController = require('../controllers/contestController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const checkToken = require('../middlewares/checkToken');
const upload = require('../utils/fileUpload');

const contestRouter = express.Router();

contestRouter.use(checkToken.checkToken);

contestRouter
  .route('/')
  .get(basicMiddlewares.onlyForCreative, contestController.getContests)
  .patch(
    basicMiddlewares.onlyForCustomer,
    upload.updateContestFile,
    contestController.updateContest
  );

contestRouter.get('/data', contestController.dataForContest);

contestRouter.get('/customer', contestController.getCustomersContests);

contestRouter.get('/downloadFile/:fileName', contestController.downloadFile);

contestRouter.get(
  '/:id',
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

module.exports = contestRouter;
