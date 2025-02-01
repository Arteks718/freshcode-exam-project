module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Chats', {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
    catalogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Catalogs',
        key: 'id',
      },
    },
  });
};
