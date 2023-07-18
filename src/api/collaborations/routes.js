const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.postCollaboratorHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  // {
  //   method: "DELETE",
  //   path: "/collaborations",
  //   handler: handler.deleteCollaboratorHandler,
  //   options: {
  //     auth: "openapimusic_jwt",
  //   },
  // },
];

module.exports = routes;
