const autoBind = require("auto-bind");

class SongsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } =
      request.payload;
    const songId = await this._services.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    const response = h.response({
      status: "success",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;
    const songs = await this._services.getSongs({ title, performer });
    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._services.getSongById(id);

    const response = h.response({
      status: "success",
      data: {
        song,
      },
    });
    response.code(200);

    return response;
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    await this._services.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    return {
      status: "success",
      message: "Berhasil memperbarui lagu",
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._services.deleteSongById(id);

    return {
      status: "success",
      message: "Berhasil menghapus lagu",
    };
  }
}

module.exports = SongsHandler;
