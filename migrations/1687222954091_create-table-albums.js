/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    year: {
      type: "NUMERIC",
      notNull: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    songs: {
      type: "TEXT[]",
    },
  });
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "NUMERIC",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "NUMERIC",
    },
    albumId: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("albums");
  pgm.dropTable("songs");
};
