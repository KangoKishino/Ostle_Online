'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      hole_coordinates: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      host_coordinates1: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      host_coordinates2: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      host_coordinates3: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      host_coordinates4: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      host_coordinates5: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      guest_coordinates1: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      guest_coordinates2: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      guest_coordinates3: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      guest_coordinates4: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      guest_coordinates5: {
        allowNull: false,
        type: Sequelize.TINYINT,
      },
      new_coordinates: {
        type: Sequelize.TINYINT,
      },
      old_coordinates: {
        type: Sequelize.TINYINT,
      },
      my_turn: {
        type: Sequelize.STRING,
      },
      time_out: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Boards');
  },
};
