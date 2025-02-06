const _ = require('lodash');
const { Sequelize, Op } = require('sequelize');
const db = require('../db/models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const { updateConversation } = require('./queries/chatQueries');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

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

    const message = await db.Messages.create(
      {
        sender: req.tokenData.userId,
        body: req.body.messageBody,
        conversationId: conversation.id,
      },
      {
        timestamps: false,
      }
    );

    const interlocutorId = participants.filter(
      (participant) => participant !== req.tokenData.userId
    )[0];

    const preview = {
      id: conversation.id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createdAt: message.createdAt,
      participants,
      blackList: conversation.blackList,
      favoriteList: conversation.favoriteList,
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        ...preview,
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });
    res.send({
      message,
      preview: { ...preview, interlocutor: req.body.interlocutor },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

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
      id: req.body.interlocutorId,
    });
    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversations = await db.Conversations.findAll({
      where: {
        participants: {
          [Op.contains]: [req.tokenData.userId],
        },
      },
      attributes: [
        'id',
        'participants',
        'blackList',
        'favoriteList',
        'updatedAt',
        [
          Sequelize.literal(`(
          SELECT "createdAt"
          FROM "Messages"
          WHERE "conversationId" = "Conversations"."id"
          ORDER BY "createdAt" DESC
          LIMIT 1
        )`),
          'createdAt',
        ],
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const interlocutors = conversations.map((conversation) =>
      conversation.participants.find(
        (participant) => participant !== req.tokenData.userId
      )
    );

    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach((conversation) => {
      senders.forEach((sender) => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });

    res.send(conversations);
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
    const predicate = 'blackList'
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
    controller.getChatController().emitChangeBlockStatus(interlocutorId, conversation);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const {
    body: { blackListFlag, participants, currentFavoriteList },
    tokenData: { userId },
  } = req;

  try {
    const predicate = 'blackList'
    const participantIndex = participants.indexOf(userId);
    currentFavoriteList[participantIndex] = blackListFlag;

    const conversation = await updateConversation(
      predicate,
      currentBlackList,
      participants
    );

    res.send(conversation);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const catalogs = await db.Catalogs.create({
      userId: req.tokenData.userId,
      catalogName: req.body.catalogName,
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
  try {
    const catalog = await db.Catalogs.update(
      {
        catalogName: req.body.catalogName,
      },
      {
        where: {
          id: req.body.catalogId,
          userId: req.tokenData.userId,
        },
        raw: true,
        returning: true,
        plain: true,
      }
    );

    const chats = await db.Chats.findAll();

    const chatsForCatalog = chats.filter(
      (chat) => chat.catalogId === catalog[1].id
    );

    res.send({ ...catalog[1], chats: chatsForCatalog });
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    await db.Chats.create({
      catalogId: req.body.catalogId,
      conversationId: req.body.chatId,
    });

    const catalogs = await db.Chats.findAll({
      where: {
        conversationId: req.body.chatId,
      },
    });
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    await db.Chats.destroy({
      where: {
        catalogId: req.body.catalogId,
        conversationId: req.body.chatId,
      },
    });
    const catalogs = await db.Catalogs.findOne({
      where: {
        id: req.body.catalogId,
      },
      include: [
        {
          model: db.Chats,
        },
      ],
    });
    catalogs.dataValues.chats = catalogs.dataValues.Chats;
    delete catalogs.dataValues.Chats;

    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await db.Catalogs.destroy({
      where: {
        id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await db.Catalogs.findAll({
      where: {
        userId: req.tokenData.userId,
      },
      raw: true,
    });

    const chats = await db.Chats.findAll();

    const catalogsWithChats = catalogs.map((catalog) => {
      const chatsForCatalog = chats.filter(
        (chat) => chat.catalogId === catalog.id
      );
      return { ...catalog, chats: chatsForCatalog };
    });

    res.send(catalogsWithChats);
  } catch (err) {
    next(err);
  }
};
