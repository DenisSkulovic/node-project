const jwt = require("jsonwebtoken");

function authenticateAccessToken(req) {
  const accessToken = req.header("AccessToken");
  return jwt.verify(accessToken, process.env.SECRET);
}

function authenticateRefreshToken(req) {
  const refreshToken = req.header("RefreshToken");
  return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
}

function generateAccessToken(data) {
  return jwt.sign(data, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
}

function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_SECRET);
}

module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
