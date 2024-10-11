"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kota extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kota.belongsTo(models.Provinsi, {
        as: "provinsi",
        foreignKey: "id_provinsi",
      });
    }
  }
  Kota.init(
    {
      id_kota: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_provinsi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "provinsi",
          key: "id_provinsi",
        },
      },
      nama_kota: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Kota",
      tableName: "kota",
      timestamps: false,
    }
  );
  return Kota;
};
