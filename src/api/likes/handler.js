const autoBind = require("auto-bind");

class LikesHandler {
  constructor(services) {
    this._services = services;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: idAlbum } = request.params;
    const { id: idUser } = request.auth.credentials;

    await this._services.addLike({ idAlbum, idUser });

    const response = h.response({
      status: "success",
      message: "Berhasil menyukai album",
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: idAlbum } = request.params;
    const { id: idUser } = request.auth.credentials;

    await this._services.deleteLike({ idAlbum, idUser });

    const response = h.response({
      status: "success",
      message: "Berhasil membatalkan like pada album",
    });
    return response;
  }

  async getLikesHandler(request) {
    const { id } = request.params;

    const likes = await this._services.getLikesCount(id);

    return {
      status: "success",
      data: { likes },
    };
  }
}

module.exports = LikesHandler;
