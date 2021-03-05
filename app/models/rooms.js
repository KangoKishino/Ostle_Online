'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rooms.init(
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      full_capacity: DataTypes.TINYINT,
      status: DataTypes.STRING,
      play_first: DataTypes.STRING,
      time: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: 'Rooms',
    }
  );
  return Rooms;
};
