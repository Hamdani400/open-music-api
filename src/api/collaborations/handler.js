const autoBind = require("auto-bind");

class CollaborationsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaboratorHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    const collaborationId = await this._services.addCollaborator({
      playlistId,
      userId,
      userLoggedInId: credentialId,
    });

    const response = h.response({
      status: "success",
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CollaborationsHandler;
