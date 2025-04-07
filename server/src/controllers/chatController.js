const _ = require('lodash');
const db = require('../db/models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const {
  updateConversation,
  findConversations,
  findCatalogsByUser,
  findCatalogByIdWithChats,
  updateCatalog,
  createMessage,
} = require('./queries/chatQueries');

module.exports.addMessage = async (req, res, next) => {
  const {
    body: { messageBody, recipient, interlocutor },
    tokenData: { userId, firstName, lastName, displayName, avatar, email },
  } = req;
  const participants = [userId, recipient].sort((a, b) => a - b);
  const interlocutorId = participants.filter(
    (participant) => participant !== userId
  )[0];

  try {
    const [conversation] = await db.Conversations.findOrCreate({
      where: {
        participants,
      },
      defaults: {
        participants,
      },
      raw: true,
    });

    const message = await createMessage(userId, messageBody, conversation.id);

    const preview = {
      id: conversation.id,
      sender: userId,
      text: messageBody,
      createdAt: message.createdAt,
      participants,
      blackList: conversation.blackList,
      favoriteList: conversation.favoriteList,
    };

    res.send({
      message,
      preview: { ...preview, interlocutor },
    });

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        ...preview,
        interlocutor: {
          id: userId,
          firstName,
          lastName,
          displayName,
          avatar,
          email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const {
    params: { interlocutorId },
    tokenData: { userId },
  } = req;

  const participants = [userId, interlocutorId].sort((a, b) => a - b);

  try {
    const messages = await db.Messages.findAll({
      include: [
        {
          model: db.Conversations,
          where: {
            participants,
          },
          attributes: [],
        },
      ],
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'sender', 'body', 'conversationId', 'createdAt'],
    });

    const interlocutor = await userQueries.findUser({
      id: interlocutorId,
    });

    const { firstName, lastName, displayName, id, avatar } = interlocutor;

    res.send({
      messages,
      interlocutor: {
        firstName,
        lastName,
        displayName,
        id,
        avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const conversations = await findConversations(userId);

    const interlocutors = conversations.map((conversation) =>
      conversation.participants.find((participant) => participant !== userId)
    );

    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      raw: true,
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    const sendersMap = senders.reduce((acc, sender) => {
      acc[sender.id] = sender;
      return acc;
    }, {});

    const updatedConversations = conversations.map((conversation) => {
      const interlocutorId = conversation.participants.find(
        (participant) => participant !== userId
      );
      return {
        ...conversation,
        interlocutor: sendersMap[interlocutorId],
      };
    });

    res.send(updatedConversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const {
    body: { blackListFlag, participants, currentBlackList },
    tokenData: { userId },
  } = req;

  try {
    const predicate = 'blackList';
    const participantIndex = participants.indexOf(userId);
    currentBlackList[participantIndex] = blackListFlag;

    const conversation = await updateConversation(
      predicate,
      currentBlackList,
      participants
    );

    res.send(conversation);

    const interlocutorId = participants.filter(
      (participant) => participant !== userId
    )[0];
    controller
      .getChatController()
      .emitChangeBlockStatus(interlocutorId, conversation);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const {
    body: { favoriteFlag, participants, currentFavoriteList },
    tokenData: { userId },
  } = req;

  try {
    const predicate = 'favoriteList';
    const participantIndex = participants.indexOf(userId);
    currentFavoriteList[participantIndex] = favoriteFlag;

    const conversation = await updateConversation(
      predicate,
      currentFavoriteList,
      participants
    );

    res.send(conversation);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const {
    body: { catalogName },
    tokenData: { userId },
  } = req;
  try {
    const catalogs = await db.Catalogs.create({
      userId,
      catalogName,
    });
    const result = {
      ...catalogs.dateValues,
      chats: [],
    };

    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  const {
    body: { catalogName, catalogId },
    tokenData: { userId },
  } = req;

  try {
    const catalog = await updateCatalog(catalogName, catalogId, userId);
    const chats = await db.Chats.findAll();

    const chatsForCatalog = chats.filter(
      (chat) => chat.catalogId === catalog.id
    );

    res.send({ ...catalog, chats: chatsForCatalog });
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const { catalogId, chatId } = req.body;

  try {
    await db.Chats.create({ catalogId, conversationId: chatId });
    const newCatalogs = await db.Chats.findAll({
      where: { conversationId: chatId },
    });
    res.send(newCatalogs);
  } catch (error) {
    next(error);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const {
    params: { catalogId, chatId },
  } = req;

  try {
    await db.Chats.destroy({
      where: {
        catalogId: catalogId,
        conversationId: chatId,
      },
    });
    const catalogs = await findCatalogByIdWithChats(catalogId);

    res.send({
      ...catalogs.dataValues,
      chats: catalogs.dataValues.Chats,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const {
    params: { catalogId },
    tokenData: { userId },
  } = req;
  try {
    await db.Catalogs.destroy({
      where: {
        id: catalogId,
        userId,
      },
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const {
    tokenData: { userId },
  } = req;

  try {
    const catalogs = await findCatalogsByUser(userId);

    const chats = await db.Chats.findAll();

    const chatsMap = chats.reduce((acc, chat) => {
      if (!acc[chat.catalogId]) {
        acc[chat.catalogId] = [];
      }
      acc[chat.catalogId].push(chat);
      return acc;
    }, {});

    const catalogsWithChats = catalogs.map((catalog) => ({
      ...catalog,
      chats: chatsMap[catalog.id] || [],
    }));

    res.send(catalogsWithChats);
  } catch (err) {
    console.log('errrroor', err);
    next(err);
  }
};
