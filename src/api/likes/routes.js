const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikeHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteLikeHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getLikesHandler,
  },
];

module.exports = routes;
