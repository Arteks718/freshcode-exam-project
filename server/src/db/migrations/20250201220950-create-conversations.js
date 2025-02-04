module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      participants: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      blackList: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        allowNull: false,
        defaultValue: [false, false]
      },
      favoriteList: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        allowNull: false,
        defaultValue: [false, false]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Conversations');
  }
};