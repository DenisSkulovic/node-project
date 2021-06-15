const express = require("express");
const router = express.Router();
const {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/auth");
const { getSuccessMessage, errorMessage, status } = require("../utils/status");
const {
  getUserPasswordAndAdminStatus,
  register,
  change_password,
} = require("../database/auth");

// https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js
// has to be a let to apply a filter function; of course it's possible to do it differently and have a const
let refreshTokens = [];

//
//
//
//
// ###############################################################
router.post("/refreshtoken", async (req, res) => {
  if (!req.body.refreshToken) {
    return res.status(status["bad"]).end();
  }
  if (!refreshTokens.includes(req.body.refreshToken)) {
    return res.status(status["notfound"]).end();
  }

  let user = authenticateRefreshToken(req.body.refreshToken);
  if (!user.email) {
    return res.status(status["forbidden"]).end();
  }

  let result = await getUserPasswordAndAdminStatus(user.email);
  let isadmin = result.rows[0]["isadmin"];

  const accessToken = generateAccessToken({
    email: user.email,
    isadmin: isadmin,
  });

  let message = getSuccessMessage(user);
  message["isAuthenticated"] = true;
  message["isAdmin"] = isadmin ? true : false;
  return res.status(status["success"]).json({
    accessToken: accessToken,
    message: message,
  });
});

//
//
//
//
// ###############################################################
router.post("/login", async function (req, res) {
  let user = authenticateAccessToken(req);
  let message = getSuccessMessage(user);

  if (!req.body.email || !req.body.password) {
    return res.status(status["bad"]).end();
  }

  let result = await getUserPasswordAndAdminStatus(req.body.email);

  if (req.body.password != result.rows[0]["password"]) {
    return res.status(status["error"]).end();
  }

  let isadmin = result.rows[0]["isadmin"];

  const accessToken = generateAccessToken({
    email: req.body.email,
    isadmin: isadmin,
  });

  const refreshToken = generateRefreshToken({
    email: req.body.email,
    isadmin: isadmin,
  });

  refreshTokens.push(refreshToken);

  console.log("isadmin", isadmin);
  message["isAuthenticated"] = true;
  message["isAdmin"] = isadmin ? true : false;
  return res.status(status["success"]).json([
    {
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: message,
    },
  ]);
});

//
//
//
//
// ###############################################################
router.post("/register", async function (req, res) {
  let user = authenticateAccessToken(req);
  let message = getSuccessMessage(user);

  if (!req.body.email || !req.body.password) {
    return res.status(status["bad"]).end();
  }

  let result = await register(
    req.body.email,
    req.body.password,
    user.isadmin && req.body.isadmin ? req.body.isadmin : false
  );

  if (!result) {
    return res.status(status["error"]).end();
  }

  const accessToken = generateAccessToken({
    email: req.body.email,
    isadmin: user.isadmin && req.body.isadmin ? req.body.isadmin : false,
  });
  const refreshToken = generateRefreshToken({
    email: req.body.email,
    isadmin: user.isadmin && req.body.isadmin ? req.body.isadmin : false,
  });
  refreshTokens.push(refreshToken);

  message["isAuthenticated"] = true;
  message["isAdmin"] = user.isadmin ? true : false;
  return res.status(status["created"]).json([
    {
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: message,
    },
  ]);
});

//
//
//
//
// ###############################################################
router.post("/logout", async function (req, res) {
  let user = authenticateAccessToken(req);
  let message = getSuccessMessage(user);

  // better to move this refresh tokens list into the database (later)
  refreshTokens = refreshTokens.filter((t) => t !== req.body.refreshToken);

  message["isAuthenticated"] = false;
  message["isAdmin"] = false;
  return res.status(status["success"]).json([{ message: message }]);
});

//
//
//
//
// ###############################################################
router.post("/change-password", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.email) {
    return res.status(status["unauthorized"].end());
  }
  if (!req.body.email || !req.body.password) {
    return res.status(status["bad"]).end();
  }

  // verify entered email & password
  let userData = await getUserPasswordAndAdminStatus(req.body.email);
  if (
    !user.isadmin &&
    (`${req.body.password}` !== `${userData.rows[0]["password"]}` ||
      `${user.email}` !== `${req.body.email}`)
  ) {
    return res.status(status["unauthorized"]).end();
  }

  let result = await change_password(
    user.isadmin ? req.body.email : user.email,
    req.body.newPassword
  );

  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ###############################################################
module.exports = router;
