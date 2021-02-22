'use strict';

const db = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'rooms',
      [
        {
          name: 'test Room',
          password: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'test Room2',
          password: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Rooms', null, {});
  },
};
