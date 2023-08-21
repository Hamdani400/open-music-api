const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, year, name],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.[0]?.id) {
      throw new InvariantError("Gagal menambahkan album");
    }

    return result?.rows?.[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result?.rows?.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const songsQuery = {
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [result.rows[0].id],
    };
    const songsResult = await this._pool.query(songsQuery);
    result.rows[0].songs = songsResult.rows.map((song) => {
      return {
        id: song.id,
        title: song.title,
        performer: song.performer,
      };
    });

    const finalResult = {
      ...result.rows[0],
      year: +result.rows[0].year,
      coverUrl: result.rows[0].cover_url,
    };
    delete finalResult.cover_url;
    return finalResult;
  }

  async editAlbumById(id, { year, name }) {
    const query = {
      text: "UPDATE albums SET year = $1, name = $2 WHERE id = $3 RETURNING id",
      values: [year, name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.length) {
      throw new NotFoundError(
        "Gagal memperbarui album. id album tidak ditemukan"
      );
    }

    return result.rows[0];
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.length) {
      throw new NotFoundError(
        "Gagal menghapus album. id album tidak ditemukan"
      );
    }
  }
}

module.exports = AlbumsServices;
