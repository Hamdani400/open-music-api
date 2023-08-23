const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const ClientError = require("../../exceptions/ClientError");

class LikesServcies {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike({ idAlbum, idUser }) {
    await this.verifyLikeAlbum(idAlbum, idUser);

    const id = `like-${idAlbum}-${idUser}`;
    const query = {
      text: `INSERT INTO likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, idUser, idAlbum],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.[0]?.id) {
      throw new InvariantError("Terjadi kesalahan, gagal menyukai album");
    }

    this._cacheService.del(`like:${idAlbum}`);
  }

  async deleteLike({ idAlbum, idUser }) {
    const id = `like-${idAlbum}-${idUser}`;

    const query = {
      text: `DELETE FROM likes WHERE id = $1 RETURNING id`,
      values: [`like-${idAlbum}-${idUser}`],
    };
    const result = await this._pool.query(query);

    if (!result.rows?.length) {
      throw new NotFoundError("Gagal batal menyukai, album tidak ditemukan");
    }
    this._cacheService.del(`like:${idAlbum}`);
  }

  async getLikesCount(id) {
    let isFromCache = false;
    try {
      const result = await this._cacheService.get(`like:${id}`);
      isFromCache = true;
      return { likes: JSON.parse(result), isFromCache };
    } catch {
      const query = {
        text: `SELECT * FROM likes WHERE album_id = $1`,
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError(
          "Gagal mendapatkan jumlah likes, album tidak ditemukan"
        );
      }

      this._cacheService.set(`like:${id}`, JSON.stringify(result.rows.length));
      return { likes: result.rows.length, isFromCache };
    }
  }

  async verifyLikeAlbum(idAlbum, idUser) {
    const albumQuery = {
      text: `SELECT * FROM albums WHERE id = $1`,
      values: [idAlbum],
    };

    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const likeQuery = {
      text: `SELECT * FROM likes WHERE id = $1`,
      values: [`like-${idAlbum}-${idUser}`],
    };

    const likeResult = await this._pool.query(likeQuery);

    if (likeResult.rows.length) {
      throw new ClientError(
        "Hanya bisa menyukai satu kali pada album yang sama"
      );
    }
  }
}

module.exports = LikesServcies;
