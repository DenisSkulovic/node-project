const express = require("express");
const router = express.Router();
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
  let result = await register(req.body.email, req.body.password);
  res.json([{ result: result }]);
});

router.post("/logout", async function (req, res, next) {
  let result = req.session.destroy();
  res.json([{ result: result }]);
});

router.post("/change-password", async function (req, res, next) {
  res.json([{ result: result }]);
});

module.exports = router;
