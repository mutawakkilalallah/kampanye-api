"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tps.belongsTo(models.Kelurahan, {
        as: "kelurahan",
        foreignKey: "id_kelurahan",
      });
      // Tps.belongsTo(models.HitungTps, {
      //   as: "hitungtps",
      //   foreignKey: "tps_id",
      //   targetKey: "tps_id",
      // });
    }
  }
  Tps.init(
    {
      tps_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      id_kelurahan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "kelurahan",
          key: "id_kelurahan",
        },
      },
      tps_kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      tps_nomor: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      tps_jml_dpt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Tps",
      tableName: "tps",
      timestamps: false,
    }
  );
  return Tps;
};
