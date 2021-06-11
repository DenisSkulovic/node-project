const jwt = require("express-jwt");
const { secret } = require("../config.json");

function authenticateJwtRequestToken() {
  return jwt({ secret: secret, algorithms: ["RS256"] }).unless({
    path: [
      // public routes that don't require authentication
      "/users/login",
      "/users/register",
      "static/*",
    ],
  });
}

module.exports = authenticateJwtRequestToken;
