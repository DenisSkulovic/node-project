const jwt = require("jsonwebtoken");

//
// ###############################################################################
/**
 * authenticateAccessToken
 * @param {string} accessToken
 * @returns {object} decyphered token
 */
function authenticateAccessToken(accessToken) {
  return jwt.verify(accessToken, process.env.SECRET);
}

//
// ###############################################################################
/**
 * authenticateRefreshToken
 * @param {string} refreshToken
 * @returns {object} decyphered token
 */
function authenticateRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, process.env.REFRESH_SECRET);
}

//
// ###############################################################################
/**
 * generateAccessToken
 * @param {object} data
 * @returns {string} access token
 */
function generateAccessToken(data) {
  return jwt.sign(data, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
}

//
// ###############################################################################
/**
 * generateRefreshToken
 * @param {object} data
 * @returns {string} refresh token
 */
function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_SECRET);
}

//
// ###############################################################################
module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
