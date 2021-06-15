const jwt = require("jsonwebtoken");

//
//
//
//
// ###################################################################################
/**
 * Authenticate request object. The request has to have an "AccessToken" header.
 * Returns a deciphered token with email, admin status, etc.
 * @param {object} req
 * @returns {object}
 */
function authenticateAccessToken(req) {
  const accessToken = req.header("AccessToken");
  if (!accessToken) {
    console.log("No AccessToken");
    return;
  }

  let result = {};
  try {
    result = jwt.verify(accessToken, process.env.SECRET);
  } catch (err) {
    console.log(err);
  }

  if (Object.keys(result).length === 0) {
    result["email"] = "";
    result["isadmin"] = "";
  }
  return result;
}

//
//
//
//
// ###################################################################################
/**
 * Authenticate request object. The request has to have a "RefreshToken" header.
 * Returns a deciphered token with email, admin status, etc.
 * @param {object} req
 * @returns {object}
 */
function authenticateRefreshToken(req) {
  const refreshToken = req.header("RefreshToken");
  if (!refreshToken) {
    return;
  }

  let result = {};
  try {
    result = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    console.log(err);
  }

  if (Object.keys(result).length === 0) {
    result["email"] = "";
    result["isadmin"] = "";
  }
  return result;
}

//
//
//
//
// ###################################################################################
/**
 * Get an AccessToken for the provided data. Assigns an expiry to the token.
 * @param {object} data
 * @returns {string}
 */
function generateAccessToken(data) {
  return jwt.sign(data, process.env.SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
}

//
//
//
//
// ###################################################################################
/**
 * Get a RefreshToken for the provided data. Assigns an expiry to the token.
 * @param {object} data
 * @returns {string}
 */
function generateRefreshToken(data) {
  return jwt.sign(data, process.env.REFRESH_SECRET);
}

//
//
//
//
// ###################################################################################
module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
};
