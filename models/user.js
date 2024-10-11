"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Tps, { as: "tps", foreignKey: "tps_id" });
      User.hasOne(models.HitungTps, { as: "hitungtps", foreignKey: "id_user" });
      User.hasMany(models.HitungSuara, {
        as: "hitungsuara",
        foreignKey: "id_user",
      });
    }
  }
  User.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      //   id_level: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //   },
      //   id_provinsi: {
      //     type: DataTypes.INTEGER,
      //     allowNull: true,
      //     references: {
      //       model: "provinsi",
      //       key: "id_provinsi",
      //     },
      //   },
      //   id_kota: {
      //     type: DataTypes.STRING(20),
      //     allowNull: true,
      //     references: {
      //       model: "kota",
      //       key: "id_kota",
      //     },
      //   },
      //   id_kecamatan: {
      //     type: DataTypes.STRING(20),
      //     allowNull: true,
      //     references: {
      //       model: "kecamatan",
      //       key: "id_kecamatan",
      //     },
      //   },
      //   id_kelurahan: {
      //     type: DataTypes.STRING(20),
      //     allowNull: true,
      //     references: {
      //       model: "keluarahan",
      //       key: "id_keluarahan",
      //     },
      //   },
      tps_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "tps",
          key: "tps_id",
        },
      },
      //   paslon_id: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //   },
      //   nik: {
      //     type: DataTypes.STRING(50),
      //     allowNull: true,
      //   },
      //   foto: {
      //     type: DataTypes.STRING(150),
      //     allowNull: false,
      //     defaultValue: "avatar.png",
      //   },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      //   password: {
      //     type: DataTypes.STRING(50),
      //     allowNull: true,
      //   },
      nama: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      //   email: {
      //     type: DataTypes.STRING(150),
      //     allowNull: true,
      //   },
      //   no_telp: {
      //     type: DataTypes.STRING(20),
      //     allowNull: true,
      //   },
      //   alamat: {
      //     type: DataTypes.STRING(255),
      //     allowNull: true,
      //   },
      //   blokir: {
      //     type: DataTypes.TINYINT(1),
      //     allowNull: false,
      //     defaultValue: 0,
      //   },
      //   verifikasi: {
      //     type: DataTypes.STRING(10),
      //     allowNull: true,
      //   },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
      timestamps: false,
    }
  );
  return User;
};
