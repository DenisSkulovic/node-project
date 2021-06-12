const express = require("express");
const router = express.Router();
const { successMessage, errorMessage, status } = require("../../utils/status");
const {
  get_field_type_for_field_type_id,
  get_field_types_list,
  create_field_type,
  update_field_type,
  delete_field_type,
} = require("../../database/field_types");

// ########################################################################################
//
// PUBLIC
//
router.get("/:fieldTypeID(\\d+)/", async function (req, res, next) {
  // query
  let result = await get_field_type_for_field_type_id(req.params.fieldTypeID);
  if (result) {
    // response
    res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// PUBLIC
//
router.get("/all", async function (req, res, next) {
  // query
  let result = await get_field_types_list();
  if (result) {
    // response
    res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// ADMIN
//
router.post("/create", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_field_type(req.body.name);
  if (result) {
    // response
    res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// ADMIN
//
router.put("/:fieldTypeID(\\d+)/update", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    res.status(status["unauthorized"]).end();
  }

  // query
  let result = await update_field_type(req.body.name, req.params.fieldTypeID);
  if (result) {
    // response
    res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// ADMIN
//
router.delete("/:fieldTypeID(\\d+)/delete", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_field_type(req.params.fieldTypeID);
  if (result) {
    // response
    res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    res.status(status["notfound"]).end();
  }
});

// ########################################################################################
module.exports = router;
