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
          full_capacity: 1,
          status: '',
          play_first: 'host',
          time: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'test Room2',
          password: '',
          full_capacity: 1,
          status: '',
          play_first: 'host',
          time: 1,
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
