/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.playlist_id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.user_id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("collaborations", "fk_collaborations.playlist_id");
  pgm.dropConstraint("collaborations", "fk_collaborations.user_id.user_id");
};
