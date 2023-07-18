const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getSongPlaylistHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deleteSongPlaylistHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: handler.getPlaylistActivitiesHandler,
    options: {
      auth: "openapimusic_jwt",
    },
  },
];

module.exports = routes;
