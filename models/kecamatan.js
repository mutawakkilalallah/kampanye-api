"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kecamatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kecamatan.belongsTo(models.Kota, {
        as: "kota",
        foreignKey: "id_kota",
      });
    }
  }
  Kecamatan.init(
    {
      id_kecamatan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_kota: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "kota",
          key: "id_kota",
        },
      },
      nama_kecamatan: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Kecamatan",
      tableName: "kecamatan",
      timestamps: false,
    }
  );
  return Kecamatan;
};
