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

  async getLikesHandler(request, h) {
    const { id } = request.params;

    const { likes, isFromCache } = await this._services.getLikesCount(id);

    const response = h.response({
      status: "success",
      data: { likes },
    });
    if (isFromCache) response.header("X-Data-Source", "cache");

    return response;
  }
}

module.exports = LikesHandler;
