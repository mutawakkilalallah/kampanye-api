"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Paslon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Paslon.init(
    {
      paslon_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      paslon_nourut: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      paslon_nama: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      paslon_foto: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Paslon",
      tableName: "c_paslon",
      timestamps: false,
    }
  );
  return Paslon;
};
