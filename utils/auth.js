const jwt = require("jsonwebtoken");

//
//
//
//
// ###################################################################################
/**
 *
 * @param {*} req
 * @returns
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
 *
 * @param {*} req
 * @returns
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
 *
 * @param {object} data
 * @returns
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
 *
 * @param {*} data
 * @returns
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
