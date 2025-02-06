const db = require('../../db/models');
const ServerError = require('../../errors/ServerError');

module.exports.chatsForCatalog = async () => {};

module.exports.updateConversation = async (predicate, value, participants) => {
  const [updatedCount, [conversation]] = await db.Conversations.update(
    {
      [predicate]: value,
    },
    {
      where: {
        participants,
      },
      returning: true,
      raw: true,
    }
  );
  if (!updatedCount) {
    throw new ServerError('Conversation update failed');
  }

  return conversation;
};

module.exports.findConversations = async (userId) => {
  const conversations = await db.Conversations.findAll({
    where: {
      participants: {
        [db.Sequelize.Op.contains]: [userId],
      },
    },
    attributes: [
      'id',
      'participants',
      'blackList',
      'favoriteList',
      'updatedAt',
      [
        db.Sequelize.literal(`(
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

  return conversations;
};

module.exports.findCatalogsByUser = async (userId) => {
  const catalogs = await db.Catalogs.findAll({
    where: {
      userId,
    },
    raw: true,
  });

  return catalogs;
};

module.exports.findCatalogByIdWithChats = async (catalogId) => {
  const catalogs = await db.Catalogs.findOne({
    where: {
      id: catalogId,
    },
    include: [
      {
        model: db.Chats,
      },
    ],
  });
  return catalogs;
};

module.exports.updateCatalog = async (catalogName, catalogId, userId) => {
  const [updatedCount, [catalog]] = await db.Catalogs.update(
    {
      catalogName,
    },
    {
      where: {
        id: catalogId,
        userId,
      },
      raw: true,
      returning: true,
    }
  );

  if (!updatedCount) {
    throw new ServerError('Conversation update failed');
  }

  return catalog;
};

module.exports.createMessage = async (sender, messageBody, conversationId) => {
  const message = await db.Messages.create(
    {
      sender,
      body: messageBody,
      conversationId: conversationId
    },
    {
      timestamps: false,
    }
  );

  if(!message) {
    throw new ServerError('Message creation failed');
  }

  return message
};
