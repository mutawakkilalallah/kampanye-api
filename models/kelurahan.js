"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kelurahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kelurahan.belongsTo(models.Kecamatan, {
        as: "kecamatan",
        foreignKey: "id_kecamatan",
      });
    }
  }
  Kelurahan.init(
    {
      id_kelurahan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_kecamatan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "kecamatan",
          key: "id_kecamatan",
        },
      },
      nama_kelurahan: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Kelurahan",
      tableName: "kelurahan",
      timestamps: false,
    }
  );
  return Kelurahan;
};
