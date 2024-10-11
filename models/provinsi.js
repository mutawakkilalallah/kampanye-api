"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Provinsi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }
  Provinsi.init(
    {
      id_provinsi: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      kodeprovinsi: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nama_provinsi: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Provinsi",
      tableName: "provinsi",
      timestamps: false,
    }
  );
  return Provinsi;
};
