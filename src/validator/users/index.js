const InvariantError = require("../../exceptions/InvariantError");
const { UsersPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const valdiationResult = UsersPayloadSchema.validate(payload);
    if (valdiationResult.error) {
      throw new InvariantError(valdiationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
