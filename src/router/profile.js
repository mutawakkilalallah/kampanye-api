const { Router } = require("express");
const { getSelf, getPaslon } = require("../controller/profile-controller");

const profile = Router();

profile.get("/", getSelf);
profile.get("/paslon", getPaslon);

module.exports = profile;
