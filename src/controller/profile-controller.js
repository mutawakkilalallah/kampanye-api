require("dotenv").config();
const {
  User,
  Tps,
  Provinsi,
  Kota,
  Kecamatan,
  Kelurahan,
  Paslon,
  HitungTps,
  HitungSuara,
} = require("../../models");

module.exports = {
  getSelf: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          id_user: req.user.id_user,
        },
        include: [
          {
            model: Tps,
            as: "tps",
            include: {
              model: Kelurahan,
              as: "kelurahan",
              include: {
                model: Kecamatan,
                as: "kecamatan",
                include: {
                  model: Kota,
                  as: "kota",
                  include: {
                    model: Provinsi,
                    as: "provinsi",
                  },
                },
              },
            },
          },
          {
            model: HitungTps,
            as: "hitungtps",
          },
          {
            model: HitungSuara,
            as: "hitungsuara",
            include: {
              model: Paslon,
              as: "paslon",
            },
          },
        ],
      });
      if (user.hitungtps) {
        user.hitungtps.htps_upload = user.hitungtps.htps_upload
          .split(",")
          .map((url) => process.env.API_URL + "/" + url.trim());
      }
      if (user.hitungsuara) {
        user.hitungsuara = user.hitungsuara.map((hpas) => {
          hpas.paslon.paslon_foto = `${process.env.WEB_URL}/assets/img/paslon/${hpas.paslon.paslon_foto}`;
        });
      }
      return res.status(200).json({
        status: 200,
        message: "OK",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "INTERNAL SERVER ERROR",
        error: err.message,
      });
    }
  },
  getPaslon: async (req, res) => {
    try {
      const paslon = await Paslon.findAll({
        order: [["paslon_nourut", "ASC"]],
      });
      paslon.map((p) => {
        p.paslon_foto = `${process.env.WEB_URL}/assets/img/paslon/${p.paslon_foto}`;
      });
      return res.status(200).json({
        status: 200,
        message: "OK",
        data: paslon,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "INTERNAL SERVER ERROR",
        error: err.message,
      });
    }
  },
};
