/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "likes",
    "fk_likes.user_id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "likes",
    "fk_likes.album_id",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("likes", "fk_likes.user_id");
  pgm.dropConstraint("likes", "fk_likes.album_id");
};
