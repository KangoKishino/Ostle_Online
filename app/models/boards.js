'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Boards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Boards.init(
    {
      host_coordinates1: DataTypes.TINYINT,
      host_coordinates2: DataTypes.TINYINT,
      host_coordinates3: DataTypes.TINYINT,
      host_coordinates4: DataTypes.TINYINT,
      host_coordinates5: DataTypes.TINYINT,
      guest_coordinates1: DataTypes.TINYINT,
      guest_coordinates2: DataTypes.TINYINT,
      guest_coordinates3: DataTypes.TINYINT,
      guest_coordinates4: DataTypes.TINYINT,
      guest_coordinates5: DataTypes.TINYINT,
      hole_coordinates: DataTypes.TINYINT,
      new_coordinates: DataTypes.TINYINT,
      old_coordinates: DataTypes.TINYINT,
      my_turn: DataTypes.STRING,
      host_time: DataTypes.TIME,
      guest_time: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: 'Boards',
    }
  );
  return Boards;
};
