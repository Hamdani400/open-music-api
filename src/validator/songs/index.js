const InvariantError = require("../../exceptions/InvariantError");
const { SongsPayloadSchema } = require("./schema");

const SongsValidator = {
  validateSongPayload: (payload) => {
    const valdiationResult = SongsPayloadSchema.validate(payload);
    if (valdiationResult.error) {
      throw new InvariantError(valdiationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
