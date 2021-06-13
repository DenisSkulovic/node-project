const express = require("express");
const router = express.Router();
const resetDatabase = require("../database/db_reset");
const { successMessage, errorMessage, status } = require("../utils/status");

//
//
router.get("/reset-database", async function (req, res) {
  let user = authenticateAccessToken(req);

  if (!user.isadmin) {
    return res.status(status["forbidden"]).end();
  }

  let result = await resetDatabase();
  return res
    .status(status["success"])
    .json([{ result: result, message: successMessage }]);
});

module.exports = router;
