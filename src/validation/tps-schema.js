const Joi = require("joi");

const tpsSchema = {
  inputSuara: Joi.object({
    tidaksah: Joi.number().required(),
    hasil_suara: Joi.required(),
  }),
};

module.exports = tpsSchema;
