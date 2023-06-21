const { nanoid } = require("nanoid");
const { Pool, Query } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.[0].id) {
      throw new InvariantError("Gagal menambahkan lagu");
    }

    return result?.rows?.[0].id;
  }

  async getSongs({ title, performer }) {
    let query;
    if (!title && !performer) {
      query = "SELECT * FROM songs";
    }
    if (title && !performer) {
      query = {
        text: "SELECT * FROM songs WHERE title ILIKE $1",
        values: [`%${title}%`],
      };
    }
    if (!title && performer) {
      query = {
        text: "SELECT * FROM songs WHERE performer ILIKE $1",
        values: [`%${performer}%`],
      };
    }
    if (title && performer) {
      query = {
        text: "SELECT * FROM songs WHERE title ILIKE $1 AND performer ILIKE $2",
        values: [`%${title}%`, `%${performer}%`],
      };
    }
    const result = await this._pool.query(query);

    return result.rows.map((item) => {
      return {
        id: item.id,
        title: item.title,
        performer: item.performer,
      };
    });
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id",
      values: [title, year, genre, performer, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError(
        "Gagal memperbarui lagu. id lagu tidak ditemukan"
      );
    }

    return result.rows[0];
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows?.length) {
      throw new NotFoundError("Gagal menghapus lagu. id lagu tidak ditemukan");
    }
  }
}

module.exports = SongsServices;
