const autoBind = require("auto-bind");

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { _data, hapi } = request.payload.cover;
    const { id } = request.params;
    this._validator.validateImageHeaders(hapi?.headers);
    const filename = await this._service.writeFile(request.payload.cover, hapi);

    await this._service.addCoverToAlbum(filename, id);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadHandler;
