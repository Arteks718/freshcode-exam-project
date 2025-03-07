const express = require('express');
const chatController = require('../controllers/chatController');
const catalogRouter = express.Router();

catalogRouter
  .route('/')
  .get(chatController.getCatalogs)
  .post(chatController.createCatalog);

catalogRouter
  .route('/:catalogId')
  .patch(chatController.updateNameCatalog)
  .delete(chatController.deleteCatalog);

catalogRouter
  .route('/:catalogId/chats')
  .post(chatController.addNewChatToCatalog);

catalogRouter
  .route('/:catalogId/chats/:chatId')
  .delete(chatController.removeChatFromCatalog);

module.exports = catalogRouter;