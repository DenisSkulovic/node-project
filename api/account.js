var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/surveys/all", function (req, res, next) {
  res.json([{ message: "This is the account endpoint." }]);
});

module.exports = router;
