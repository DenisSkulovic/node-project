const jwt = require("jsonwebtoken");

function authenticateAccessToken(req) {
  const accessToken = req.header("AccessToken");
  if (!accessToken) {
    console.log("No AccessToken");
    return;
  }
  let result = jwt.verify(accessToken, process.env.SECRET);
  console.log("accessToken email", result.email);
  if (typeof result.email === "undefined") {
    result["email"] = "";
    result["isadmin"] = "";
  }
  return result;
}

function authenticateRefreshToken(req) {
  const refreshToken = req.header("RefreshToken");
  if (!refreshToken) {
    return;
  }
  let result = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  if (typeof result.email === "undefined") {
    result["email"] = "";
    result["isadmin"] = "";
  }
  return result;
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
