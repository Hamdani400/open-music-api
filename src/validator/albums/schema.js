const Joi = require("joi");

const AlbumsPayloadSchema = Joi.object({
  year: Joi.number().required(),
  name: Joi.string().required(),
});

module.exports = { AlbumsPayloadSchema };
