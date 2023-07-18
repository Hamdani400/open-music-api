require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// services
const AlbumsServices = require("./services/postgres/AlbumsServices");
const SongsServices = require("./services/postgres/SongsServices");
const UsersServices = require("./services/postgres/UsersServices");
const AuthServices = require("./services/postgres/AuthServices");
const PlaylistsServices = require("./services/postgres/PlaylistsService");
const CollaobrationsService = require("./services/postgres/CollaborationsServices");

// api
const albums = require("./api/albums");
const songs = require("./api/songs");
const users = require("./api/users");
const auth = require("./api/auth");
const playlists = require("./api/playlists");
const collaborations = require("./api/collaborations");

// validators
const AlbumsValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");
const UsersValidator = require("./validator/users");
const AuthValidator = require("./validator/auth");
const PlaylistsValidator = require("./validator/playlists");
const CollaborationsValidator = require("./validator/collaborations");

const ClientError = require("./exceptions/ClientError");
const TokenManager = require("./tokenize/TokenManager");

const init = async () => {
  const albumsServices = new AlbumsServices();
  const songsServices = new SongsServices();
  const usersServices = new UsersServices();
  const authServices = new AuthServices();
  const collaborationsServices = new CollaobrationsService();
  const playlistsServices = new PlaylistsServices(collaborationsServices);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    console.log(response);
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("openapimusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: auth,
      options: {
        authServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsServices,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsServices,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsServices,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`server running at ${server.info.uri}`);
};

init();
