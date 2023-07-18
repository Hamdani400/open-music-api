const autoBind = require("auto-bind");

class PlaylistHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._services.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._services.getPlaylists(credentialId);

    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const { songId } = request.payload;

    await this._services.verifyPlaylistAccess(playlistId, credentialId);
    await this._services.addSongToPlaylist({ songId, playlistId });

    const response = h.response({
      status: "success",
      message: "Berhasil menambahkan lagu ke playlist",
    });
    response.code(201);
    return response;
  }

  async getSongPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._services.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._services.getPlaylistSongList({
      playlistId,
      owner: credentialId,
    });

    return {
      status: "success",
      data: { playlist },
    };
  }

  async deleteSongPlaylistHandler(request) {
    this._validator.validateDeleteSongToPlaylistPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._services.verifyPlaylistAccess(playlistId, credentialId);
    await this._services.deleteSongFromPlaylist({ songId, playlistId });

    return {
      status: "success",
      message: "Berhasil menghapus lagu dari playlist",
    };
  }

  async deletePlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._services.verifyPlaylistAccess(playlistId, credentialId);
    await this._services.deletePlaylistById(playlistId);

    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }
}

module.exports = PlaylistHandler;
