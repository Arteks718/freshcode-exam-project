const bcrypt = require('bcrypt');
const {
  MODERATOR,
  CREATOR,
  CUSTOMER,
  SALT_ROUNDS,
} = require('../../constants');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Customer',
          lastName: 'Customer',
          displayName: 'Customer',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'customer@gmail.com',
          role: CUSTOMER,
        },
        {
          firstName: 'Creative',
          lastName: 'Creative',
          displayName: 'Creative',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'creative@gmail.com',
          role: CREATOR,
        },
        {
          firstName: 'Moderator',
          lastName: 'Moderator',
          displayName: 'Moderator',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'moderator@gmail.com',
          role: MODERATOR,
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
