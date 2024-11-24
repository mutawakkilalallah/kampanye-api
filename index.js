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
              c_paslon.id_kota = "16.04"
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
              tps.id_kota = "16.04"
      ),
      total_dpt AS (
          SELECT 
              SUM(tps.tps_jml_dpt) AS total_dpt
          FROM 
              tps
          WHERE 
              tps.id_kota = "16.04"
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
  res.render("index", { data: data[0] });
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
