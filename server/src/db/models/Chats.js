module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Chats', {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Conversations',
        key: 'id',
      },
    },
    catalogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Catalogs',
        key: 'id',
      },
    },
  }, {
    timestamps: false
  });
};
