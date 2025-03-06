const express = require('express');
const { queryParser } = require('express-query-parser');
const contestController = require('../controllers/contestController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const checkToken = require('../middlewares/checkToken');
const upload = require('../utils/fileUpload');

const contestRouter = express.Router();

contestRouter.use(checkToken.checkToken);

contestRouter
  .route('/')
  .get(
    basicMiddlewares.onlyForCreative,
    queryParser({
      parseNull: true,
      parseBoolean: true,
      parseNumber: true,
      parseUndefined: true,
    }),
    contestController.getContests
  )
  .patch(
    basicMiddlewares.onlyForCustomer,
    upload.updateContestFile,
    contestController.updateContest
  );

contestRouter.get('/data', contestController.dataForContest);

contestRouter.get(
  '/customer',
  queryParser({
    parseNull: true,
    parseBoolean: true,
    parseNumber: true,
    parseUndefined: true,
  }),
  contestController.getCustomersContests
);

contestRouter.get('/downloadFile/:fileName', contestController.downloadFile);

contestRouter.get(
  '/:id',
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

module.exports = contestRouter;
