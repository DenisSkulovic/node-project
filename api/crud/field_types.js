const express = require("express");
const router = express.Router();
const {
  getSuccessMessage,
  errorMessage,
  status,
} = require("../../utils/status");
const {
  get_field_type_for_field_type_id,
  get_field_types_list,
  create_field_type,
  update_field_type,
  delete_field_type,
} = require("../../database/field_types");
const { authenticateAccessToken } = require("../../utils/auth");

//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/:fieldTypeID(\\d+)/", async function (req, res) {
  let user = authenticateAccessToken(req);

  // query
  let result = await get_field_type_for_field_type_id(req.params.fieldTypeID);

  return res
    .status(status["success"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/all", async function (req, res) {
  let user = authenticateAccessToken(req);
  // query
  let result = await get_field_types_list();

  return res
    .status(status["success"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN
 */
router.post("/create", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_field_type(req.body.name);
  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN
 */
router.put("/:fieldTypeID(\\d+)/update", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await update_field_type(req.body.name, req.params.fieldTypeID);
  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN
 */
router.delete("/:fieldTypeID(\\d+)/delete", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_field_type(req.params.fieldTypeID);
  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

// ########################################################################################
module.exports = router;
