const AuthHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "auth",
  version: "1.0.0",
  register: async (
    server,
    { authServices, usersServices, tokenManager, validator }
  ) => {
    const authHandler = new AuthHandler(
      authServices,
      usersServices,
      tokenManager,
      validator
    );
    server.route(routes(authHandler));
  },
};
