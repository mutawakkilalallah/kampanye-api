const { Router } = require("express");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const tpsRouter = require("./tps");

const auth = require("../../middleware/authentication");

const router = Router();

router.use("/", authRouter);
router.use("/profile", auth, profileRouter);
router.use("/tps", tpsRouter);

module.exports = router;
