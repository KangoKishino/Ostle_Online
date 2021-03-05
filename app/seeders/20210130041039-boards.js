'use strict';

const db = require('../models');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'rooms',
      [
        {
          host_coordinates1: 20,
          host_coordinates2: 21,
          host_coordinates3: 22,
          host_coordinates4: 23,
          host_coordinates5: 24,
          guest_coordinates1: 0,
          guest_coordinates2: 1,
          guest_coordinates3: 2,
          guest_coordinates4: 3,
          guest_coordinates5: 4,
          hole_coordinates: 12,
          new_coordinates: null,
          old_coordinates: null,
          my_turn: 'host',
          host_time: '00:05:00',
          guest_time: '00:05:00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          host_coordinates1: 20,
          host_coordinates2: 21,
          host_coordinates3: 22,
          host_coordinates4: 23,
          host_coordinates5: 24,
          guest_coordinates1: 0,
          guest_coordinates2: 1,
          guest_coordinates3: 2,
          guest_coordinates4: 3,
          guest_coordinates5: 4,
          hole_coordinates: 12,
          new_coordinates: null,
          old_coordinates: null,
          my_turn: 'host',
          host_time: '00:05:00',
          guest_time: '00:05:00',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Boards', null, {});
  },
};
