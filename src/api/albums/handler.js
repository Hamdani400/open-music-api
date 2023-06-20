const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { year, name } = request.payload;
    const albumId = await this._services.addAlbum({ year, name });

    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const result = await this._services.getAlbumById(id);

    const response = h.response({
      status: "success",
      data: {
        album: result,
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { year, name } = request.payload;
    const { id } = request.params;
    await this._services.editAlbumById(id, { year, name });

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._services.deleteAlbumById(id);

    return {
      status: "success",
      message: "Berhasil menghapus album",
    };
  }
}

module.exports = AlbumsHandler;
