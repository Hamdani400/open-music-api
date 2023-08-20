const autoBind = require("auto-bind");

class ExportHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      playlistId: request.params.id,
      targetEmail: request.payload.targetEmail,
    };
    await this._service.sendMessage("export:playlist", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Permintaan Anda dalam antrean",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
