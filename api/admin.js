const express = require("express");
const router = express.Router();
const resetDatabase = require("../database/db_setup");
const { successMessage, errorMessage, status } = require("../utils/status");

//
//
router.get("/reset-database", async function (req, res, next) {
  // check for admin status here, later
  let result = await resetDatabase();
  res
    .status(status["success"])
    .json([{ result: result, message: successMessage }]);
});

module.exports = router;
