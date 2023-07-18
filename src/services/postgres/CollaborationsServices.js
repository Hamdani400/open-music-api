const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class CollaborationsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaborator({ playlistId, userId, userLoggedInId }) {
    await this.verifyCollaboratorData({ playlistId, userId, userLoggedInId });

    const id = `collaboration-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async deleteCollaborator({ playlistId, userId, credentialId }) {
    await this.verifyCollaborationOwner(playlistId, credentialId);
    await this.verifyCollaboratorData({
      playlistId,
      userId,
      userLoggedInId: null,
    });

    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menghapus kolaborasi");
    }
  }

  async verifyCollaboratorData({ playlistId, userId, userLoggedInId }) {
    if (userId === userLoggedInId) {
      throw new AuthorizationError(
        "Tidak dapat menambahkan diri sendiri sebagai kolaborator"
      );
    }

    const playlistQuery = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const userQuery = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };

    const userResult = await this._pool.query(userQuery);

    if (!userResult.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
  }

  async verifyCollaborator({ userId, playlistId }) {
    const query = {
      text: "SELECT * FROM collaborations WHERE user_id = $1 AND playlist_id = $2",
      values: [userId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("Kolaborasi gagal diverifikasi");
    }
  }

  async verifyCollaborationOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError(
        "Anda tidak berhak mengakses kolaborasi ini"
      );
    }
  }
}

module.exports = CollaborationsServices;
