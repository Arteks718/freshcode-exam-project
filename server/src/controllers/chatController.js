const _ = require('lodash');
const db = require('../db/models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    let conversation = await db.Conversations.findOne({
      where: {
        participants,
      },
    });
    if (!conversation) {
      conversation = await db.Conversations.create({
        participants,
      });
    }

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
      createAt: message.createdAt,
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
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
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
    const conversations = await db.Messages.findAll({
      include: [
        {
          model: db.Conversations,
          where: {
            participants: {
              [db.Sequelize.Op.contains]: [req.tokenData.userId],
            },
          },
          attributes: [
            ['participants', 'participants'],
            ['blackList', 'blackList'],
            ['favoriteList', 'favoriteList'],
          ],
        },
      ],
      raw: true,
      order: [['createdAt', 'DESC']],
      attributes: [
        [
          db.Sequelize.fn('DISTINCT', db.Sequelize.col('conversationId')),
          'conversationId',
        ],
        'sender',
        'body',
        'createdAt',
        [db.Sequelize.col('Conversation.id'), 'id'],
        [db.Sequelize.col('Conversation.participants'), 'participants'],
        [db.Sequelize.col('Conversation.blackList'), 'blackList'],
        [db.Sequelize.col('Conversation.favoriteList'), 'favoriteList'],
      ],
      group: [
        'Messages.conversationId',
        'Messages.sender',
        'Messages.body',
        'Messages.createdAt',
        'Conversation.id',
        'Conversation.participants',
        'Conversation.blackList',
        'Conversation.favoriteList',
      ],
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
  try {
    const chat = await db.Conversations.findOne({
      where: {
        participants: req.body.participants,
      },
      raw: true,
    });

    const blackList = chat.blackList;
    const index = req.body.participants.indexOf(req.tokenData.userId);
    blackList[index] = req.body.blackListFlag;

    await db.Conversations.update(
      {
        blackList,
      },
      {
        where: {
          participants: req.body.participants,
        },
        returning: true,
        plain: true,
      }
    );
    chat.blackList = blackList;

    res.send(chat);

    const interlocutorId = req.body.participants.filter(
      (participant) => participant !== req.tokenData.userId
    )[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  try {
    const chat = await db.Conversations.findOne({
      where: {
        participants: req.body.participants,
      },
      raw: true,
    });

    const favoriteList = chat.favoriteList;
    const index = req.body.participants.indexOf(req.tokenData.userId);
    favoriteList[index] = req.body.favoriteFlag;

    await db.Conversations.update(
      {
        favoriteList,
      },
      {
        where: {
          participants: req.body.participants,
        },
        returning: true,
        plain: true,
      }
    );

    chat.favoriteList = favoriteList;

    res.send(chat);
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
      chats: []
    }

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
        plain: true
      }
    );

    res.send(catalog[1]);
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
      }
    })
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
        }
      ],
    })
    catalogs.dataValues.chats = catalogs.dataValues.Chats
    delete catalogs.dataValues.Chats

    res.send(catalogs)
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
