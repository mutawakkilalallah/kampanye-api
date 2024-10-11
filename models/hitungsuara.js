"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HitungSuara extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HitungSuara.belongsTo(models.Paslon, {
        as: "paslon",
        foreignKey: "paslon_id",
      });
    }
  }
  HitungSuara.init(
    {
      hpas_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      paslon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "paslon",
          key: "paslon_id",
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
      hpas_suara: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "HitungSuara",
      tableName: "hitungsuara",
      timestamps: false,
    }
  );
  return HitungSuara;
};
