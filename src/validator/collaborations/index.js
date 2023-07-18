const InvariantError = require("../../exceptions/InvariantError");
const { CollaborationsSchema } = require("./schema");

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
