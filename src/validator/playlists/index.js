const InvariantError = require("../../exceptions/InvariantError");
const {
  DeleteSongFromPlaylistSchema,
  PostPlaylistSchema,
  PostSongToPlaylistSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload) => {
    const validationResult = PostSongToPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteSongToPlaylistPayload: (payload) => {
    const validationResult = DeleteSongFromPlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
