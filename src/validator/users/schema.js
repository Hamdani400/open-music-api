const Joi = require("joi");

const UsersPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.number().required(),
  fullname: Joi.string().required(),
});

module.exports = { UsersPayloadSchema };
