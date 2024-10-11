const { Router } = require("express");
const { inputSuara } = require("../controller/tps-controller");
const upload = require("../../middleware/multer");

const tps = Router();

tps.post("/input", upload.array("images", 3), inputSuara);

module.exports = tps;
