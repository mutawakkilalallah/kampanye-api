require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRouter = require("./src/router/index");
const path = require("path");
const http = require("http");
const socket = require("./socket");
const { sequelize } = require("./models");

const app = express();
const server = http.createServer(app);

global.__base = path.join(__dirname, "/");
app.use(
  "/assets/uploads",
  express.static(path.resolve(__dirname, "assets", "uploads"))
);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    exposedHeaders:
      "x_total_data, x_page_limit, x_total_page, x_current_page, x-auth",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
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
    WHERE 
        hitungsuara.tps_id IN (SELECT tps_id FROM tps WHERE tps.id_kota = "16.71")
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
        (SELECT SUM(total_suara) FROM paslon_suara) + (SELECT total_tidaksah FROM tidak_sah_suara) AS total_suara
),
total_suara_sah AS (
    SELECT 
        SUM(total_suara) AS total_suara_sah
    FROM 
        paslon_suara
),
htps_tanggal AS (
    SELECT 
        htps_tanggal
    FROM 
        hitungtps
    LIMIT 1
)
SELECT 
    ps.paslon_id,
    ps.paslon_nama,
    ps.paslon_nourut,
    ps.paslon_foto,
    ps.total_suara AS suara_paslon,
    ts.total_tidaksah AS tidak_sah,
    tsu.total_suara AS total_suara_masuk,
    td.total_dpt,
    ti.total_tps_input,
    tt.total_tps,
    ROUND((ps.total_suara / tsu.total_suara) * 100, 2) AS persen_suara_paslon,
    ROUND((tsu.total_suara / td.total_dpt) * 100, 2) AS persen_suara_masuk,
    ROUND(ti.total_tps_input / tt.total_tps * 100, 2) AS persen_tps_input,
    tsu.total_suara - ts.total_tidaksah AS total_suara_sah,
    ROUND((ps.total_suara / (tsu.total_suara - ts.total_tidaksah)) * 100, 2) AS persen_suara_sah,
    ROUND((tsu.total_suara - ts.total_tidaksah) / td.total_dpt * 100, 2) AS persen_total_suara_sah,
    htps_t.htps_tanggal AS tanggal
FROM 
    paslon_suara ps
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
CROSS JOIN 
    total_suara_sah tsas
CROSS JOIN 
    htps_tanggal htps_t
ORDER BY 
    ps.paslon_nourut;
    `
  );
  res.render("index", { data: data[0] });
});

app.get("/cek-tps", async (req, res) => {
  const data = await sequelize.query(
    `select id_kecamatan, nama_kecamatan from kecamatan where id_kota = '16.71'`
  );
  res.render("cektps", { data: data[0] });
});

app.get("/hasil-cek-tps", async (req, res) => {
  const data = await sequelize.query(
    `SELECT k.id_kelurahan, k.nama_kelurahan, JSON_ARRAYAGG( JSON_OBJECT( 'tps_nomor', t.tps_nomor, 'htps_id', ht.htps_id ) ) AS tps FROM kelurahan k LEFT JOIN tps t ON k.id_kelurahan = t.id_kelurahan LEFT JOIN hitungtps ht ON t.tps_id = ht.tps_id WHERE k.id_kecamatan = '${req.query.kec}' GROUP BY k.id_kelurahan;`
  );
  res.json({ data: data[0] });
});

app.use("/api", apiRouter);

// Inisialisasi socket.io
const io = socket.init(server);

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`KAMPANYE API started on port ${process.env.PORT}`);
});
