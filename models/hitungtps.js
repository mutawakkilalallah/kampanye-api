"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HitungTps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }
  HitungTps.init(
    {
      htps_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tps_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tps",
          key: "tps_id",
        },
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id_user",
        },
      },
      dapil_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      kat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      htps_tidaksah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      htps_golput: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      htps_upload: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      htps_tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "HitungTps",
      tableName: "hitungtps",
      timestamps: false,
    }
  );
  return HitungTps;
};
