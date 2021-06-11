const express = require("express");
const router = express.Router();
const resetDatabase = require("../database/db_setup");

router.get("/reset-database", async function (req, res, next) {
  // check for admin status here, later
  let message = await resetDatabase();
  console.log("message", message);
  res.status(200).json([{ message: message }]);
});

module.exports = router;
