const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/auth");
const { successMessage, errorMessage, status } = require("../utils/status");
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
router.post("/refreshtoken", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(status["unauthorized"]).end();
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(status["forbidden"]).end();
  }

  let user = authenticateRefreshToken(refreshToken);
  if (!user) {
    return res.status(status["forbidden"]).end();
  }

  let result = await getUserPasswordAndAdminStatus(user.email);
  let isadmin = result.rows[0]["isadmin"];

  const accessToken = generateAccessToken({
    email: user.email,
    isadmin: isadmin,
  });

  return res.status(status["success"]).json({
    accessToken,
  });
});

//
//
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    if (email && password) {
      let result = await getUserPasswordAndAdminStatus(req.body.email);
      if (`${password}` !== `${result.rows[0]["password"]}`) {
        return res.status(status["error"]).end();
      }
      let isadmin = result.rows[0]["isadmin"];

      const accessToken = generateAccessToken({
        email: email,
        isadmin: isadmin,
      });
      const refreshToken = generateRefreshToken({
        email: email,
        isadmin: isadmin,
      });
      refreshTokens.push(refreshToken);

      return res.status(status["success"]).json([
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: successMessage,
        },
      ]);
    } else {
      return res.status(status["notfound"]).end();
    }
  } catch {
    return res.status(status["error"]).end();
  }
});

//
//
router.post("/register", async function (req, res) {
  try {
    const { email, password } = req.body;
    let isadmin = false;

    if (email && password) {
      let result = await register(req.body.email, req.body.password, isadmin);
      if (!result) {
        return res.status(status["error"]).end();
      }

      const accessToken = generateAccessToken({
        email: email,
        isadmin: isadmin,
      });
      const refreshToken = generateRefreshToken({
        email: email,
        isadmin: isadmin,
      });

      refreshTokens.push(refreshToken);

      return res.status(status["success"]).json([
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
          message: successMessage,
        },
      ]);
    } else {
      return res.status(status["notfound"]).end();
    }
  } catch {
    return res.status(status["error"]).end();
  }
});

//
//
router.post("/logout", async function (req, res) {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  res.status(status["success"]).json([{ message: successMessage }]);
});

//
//
router.post("/change-password", async function (req, res) {
  const { email, password, newPassword } = req.body;

  // verify token
  try {
    let user = authenticateAccessToken(req);
    if (!user) {
      return res.status(status["forbidden"]);
    }
    // verify entered email & password
    if (email && password) {
      let userData = await getUserPasswordAndAdminStatus(email);
      if (
        `${password}` !== `${userData.rows[0]["password"]}` ||
        `${user.email}` !== `${email}`
      ) {
        return res.status(status["unauthorized"]).end();
      }

      let result = await change_password(email, newPassword);

      return res
        .status(status["success"])
        .json([{ result: result, message: successMessage }]);
    } else {
      return res.status(status["notfound"]).end();
    }
  } catch {
    return res.status(status["error"]).end();
  }
});

module.exports = router;
