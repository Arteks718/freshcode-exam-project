const express = require('express');
const chatController = require('../controllers/chatController');
const checkToken = require('../middlewares/checkToken');
const catalogRouter = require('./catalogRouter');
const chatRouter = express.Router();

chatRouter.use(checkToken.checkToken);

chatRouter.use('/catalogs', catalogRouter);

chatRouter
  .route('/')
  .get(chatController.getPreview)
  .post(chatController.addMessage);
chatRouter.get('/:interlocutorId', chatController.getChat);
chatRouter.patch('/block', chatController.blackList);
chatRouter.patch('/favorite', chatController.favoriteChat);


module.exports = chatRouter;
