const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsServices {
  constructor(collaboratorService) {
    this._pool = new Pool();
    this._collaboratorService = collaboratorService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menambahkan playlist");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1",
      values: [owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows?.length) {
      throw new NotFoundError(
        "Gagal menghapus playlist. id playlist tidak ditemukan"
      );
    }
  }

  async addSongToPlaylist({ songId, playlistId }) {
    await this.verifyPlaylistAndSong(songId, playlistId);
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menambahkan lagu ke dalam playlist");
    }
  }

  async getPlaylistSongList({ playlistId, owner }) {
    const query = {
      text: "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE (playlists.owner = $1 OR collaborations.user_id = $1) AND playlists.id = $2",
      values: [owner, playlistId],
    };

    const result = await this._pool.query(query);

    const songQuery = {
      text: "SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE songs.id = playlist_songs.song_id AND playlist_songs.playlist_id = $1",
      values: [result.rows[0].id],
    };

    const songsResult = await this._pool.query(songQuery);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const finalResult = {
      ...result.rows[0],
      songs: songsResult.rows,
    };

    return finalResult;
  }

  async deleteSongFromPlaylist({ songId, playlistId }) {
    await this.verifyPlaylistAndSong(songId, playlistId);

    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2",
      values: [songId, playlistId],
    };

    await this._pool.query(query);
  }

  async verifyPlaylistAndSong(songId, playlistId) {
    const songQuery = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };

    const findSongResult = await this._pool.query(songQuery);

    if (!findSongResult.rows.length) {
      throw new NotFoundError("Id lagu tidak ditemukan");
    }

    const playlistQuery = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const findPlaylistResult = await this._pool.query(playlistQuery);

    if (!findPlaylistResult.rows.length) {
      throw new NotFoundError("Id playlist tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
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
      throw new AuthorizationError("Anda tidak berhak mengakses playlist ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
    }

    try {
      await this._collaboratorService.verifyCollaborator({
        userId,
        playlistId,
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PlaylistsServices;
