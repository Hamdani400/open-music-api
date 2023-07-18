/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist.song_id",
    "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist.playlist_id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlist_songs", "fk_playlist.song_id");
  pgm.dropConstraint("playlist_songs", "fk_playlist.playlist_id");
};
