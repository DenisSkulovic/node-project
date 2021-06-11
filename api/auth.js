const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const {
  getDataForLogin,
  register,
  change_password,
} = require("../database/auth");

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
  }
  // let session = req.session;
  // session.email = req.body.email

  let result = await getDataForLogin(req.body.email);
  console.log("result", result);
  res.json([{ result: result }]);
});

router.post("/register", async function (req, res, next) {
  // add express-session logic here later
  let result = await register(req.body.email, req.body.password);
  res.json([{ result: result }]);
});

router.post("/logout", async function (req, res, next) {
  // see if express-session handles cookie deletion, if not - find out what it does exactly
  let result = req.session.destroy();
  res.json([{ result: result }]);
});

router.post("/change-password", async function (req, res, next) {
  // add some permissions logic here later
  let result = await change_password(req.body.email, req.body.password);
  res.json([{ result: result }]);
});

module.exports = router;
