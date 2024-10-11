const JWT = require("jsonwebtoken");
const { User } = require("../../models");
const authSchema = require("../validation/auth-schema");

module.exports = {
  //   login
  login: async (req, res) => {
    try {
      const { error, value } = authSchema.login.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 400,
          message: "BAD REQUEST",
          error: error.message,
        });
      }
      // get data from database
      const user = await User.findOne({
        where: {
          username: value.nik,
        },
      });
      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "UNAUTHORIZED",
          error: `invalid credentials`,
        });
      }
      const token = await JWT.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "6h",
      });
      return res.status(200).json({
        status: 200,
        message: "OK",
        token: token,
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
};
