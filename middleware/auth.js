const jwt = require("jsonwebtoken");
const { privateKey } = require("../config.json");

module.exports = {
  getToken(userID, username) {
    const payload = { user_id: userID, username: username };
    return jwt.sign(payload, privateKey, {
      algorithm: "HS256",
      noTimestamp: true,
    });
  },
  decodeToken(token) {
    return jwt.verify(token, privateKey);
  },
};
