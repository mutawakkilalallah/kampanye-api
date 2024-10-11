const Joi = require("joi");

const authSchema = {
  login: Joi.object({
    nik: Joi.required(),
  }),
};

module.exports = authSchema;
