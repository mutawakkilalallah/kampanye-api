const { Tps, HitungTps, HitungSuara } = require("../../models");
const tpsSchema = require("../validation/tps-schema");

module.exports = {
  inputSuara: async (req, res) => {
    try {
      const { error, value } = tpsSchema.inputSuara.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          message: "BAD REQUEST",
          error: error.message,
        });
      }
      const tps = await Tps.findOne({
        where: {
          tps_id: req.user.tps_id,
        },
      });
      if (!tps) {
        return res.status(404).json({
          status: 404,
          message: "NOT FOUND",
          error: "tps tidak ditemukan",
        });
      }
      let htps_upload;
      if (!req.files || req.files.length === 0) {
        htps_upload = "";
      } else {
        htps_upload = req.files.map((file) => file.path).join(",");
      }
      value.hasil_suara = JSON.parse(value.hasil_suara);
      jml_suara =
        value.hasil_suara[0].suara +
        value.hasil_suara[1].suara +
        value.hasil_suara[2].suara +
        value.tidaksah;

      value.hasil_suara.map(async (hs) => {
        await HitungSuara.create({
          tps_id: req.user.tps_id,
          id_user: req.user.id_user,
          hpas_suara: hs.suara,
          paslon_id: hs.paslon_id,
        });
      });
      await HitungTps.create({
        tps_id: req.user.tps_id,
        id_user: req.user.id_user,
        htps_tidaksah: value.tidaksah,
        htps_upload,
        htps_golput: tps.tps_jml_dpt - jml_suara,
      });
      return res.status(200).json({
        status: 200,
        message: "OK",
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
