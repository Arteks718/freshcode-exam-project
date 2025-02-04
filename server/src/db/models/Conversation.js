module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Conversations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },
    blackList: {
      type: DataTypes.ARRAY(DataTypes.BOOLEAN),
      allowNull: false,
      defaultValue: [false, false]
    },
    favoriteList: {
      type: DataTypes.ARRAY(DataTypes.BOOLEAN),
      allowNull: false,
      defaultValue: [false, false]
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
}