/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "activities",
    "fk_activities.playlist_id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("activities", "fk_activities.playlist_id");
};
