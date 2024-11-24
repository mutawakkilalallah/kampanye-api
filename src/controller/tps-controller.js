const { Tps, HitungTps, HitungSuara, sequelize } = require("../../models");
const tpsSchema = require("../validation/tps-schema");
const socket = require("../../socket");

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

      const data = await sequelize.query(
        `
          WITH 
          paslon_suara AS (
              SELECT 
                  c_paslon.paslon_id,
                  c_paslon.paslon_nama,
                  c_paslon.paslon_nourut,
                  c_paslon.paslon_foto,
                  SUM(hitungsuara.hpas_suara) AS total_suara
              FROM 
                  c_paslon
              LEFT JOIN 
                  hitungsuara 
              ON 
                  c_paslon.paslon_id = hitungsuara.paslon_id
              WHERE 
                  c_paslon.id_kota = "16.71"
              GROUP BY 
                  c_paslon.paslon_id, c_paslon.paslon_nama, c_paslon.paslon_nourut, c_paslon.paslon_foto
          ),
          golput_suara AS (
              SELECT 
                  SUM(hitungtps.htps_golput) AS total_golput
              FROM 
                  hitungtps
          ),
          tidak_sah_suara AS (
              SELECT 
                  SUM(hitungtps.htps_tidaksah) AS total_tidaksah
              FROM 
                  hitungtps
          ),
          total_tps_input AS (
              SELECT 
                  COUNT(DISTINCT hitungsuara.tps_id) AS total_tps_input
              FROM 
                  hitungsuara
          ),
          total_tps AS (
              SELECT 
                  COUNT(*) AS total_tps
              FROM 
                  tps
              WHERE 
                  tps.id_kota = "16.71"
          ),
          total_dpt AS (
              SELECT 
                  SUM(tps.tps_jml_dpt) AS total_dpt
              FROM 
                  tps
              WHERE 
                  tps.id_kota = "16.71"
          ),
          total_suara_masuk AS (
              SELECT 
                  (SELECT SUM(total_suara) FROM paslon_suara) + gs.total_golput + ts.total_tidaksah AS total_suara
              FROM 
                  golput_suara gs
              CROSS JOIN 
                  tidak_sah_suara ts
          )
          SELECT 
              ps.paslon_id,
              ps.paslon_nama,
              ps.paslon_nourut,
              ps.paslon_foto,
              ps.total_suara AS suara_paslon,
              gs.total_golput AS golput,
              ts.total_tidaksah AS tidak_sah,
              tsu.total_suara AS total_suara_masuk,
              td.total_dpt,
              ti.total_tps_input,
              tt.total_tps,
              ROUND((ps.total_suara / tsu.total_suara) * 100, 2) AS persen_suara_paslon,
              ROUND(((SELECT SUM(total_suara) FROM paslon_suara) + ts.total_tidaksah) / td.total_dpt * 100, 2) AS persen_suara_masuk,
              ROUND(ti.total_tps_input / tt.total_tps * 100, 2) AS persen_tps_input
          FROM 
              paslon_suara ps
          CROSS JOIN 
              golput_suara gs
          CROSS JOIN 
              tidak_sah_suara ts
          CROSS JOIN 
              total_tps_input ti
          CROSS JOIN 
              total_tps tt
          CROSS JOIN 
              total_dpt td
          CROSS JOIN 
              total_suara_masuk tsu
          ORDER BY 
              ps.paslon_nourut;
        `
      );
      // Emit event ke semua client
      const io = socket.getIO();
      io.emit("updateData", data[0]);

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
