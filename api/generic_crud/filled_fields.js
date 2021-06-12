const express = require("express");
const router = express.Router();
const { successMessage, errorMessage, status } = require("../../utils/status");
const {
  isPublic_filled_field,
  isOwner_filled_field,
  get_filled_field_for_filled_field_id,
  get_filled_fields_list_for_filled_survey_id,
  create_filled_field,
  update_filled_field,
  delete_filled_field,
} = require("../../database/filled_fields");

// ########################################################################################
//
// PUBLIC
//
router.get("/:filledFieldID(\\d+)/", async function (req, res, next) {
  // query
  let result = await get_filled_field_for_filled_field_id(
    req.params.filledFieldID
  );
  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// PUBLIC
//
router.get("/:filledSurveyID(\\d+)/", async function (req, res, next) {
  // query
  let result = await get_filled_fields_list_for_filled_survey_id(
    req.params.filledSurveyID
  );
  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
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
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_filled_field(
    req.body.survey_field_id,
    req.body.filled_survey_id,
    req.body.answer
  );
  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// ADMIN
//
router.put("/:filledFieldID(\\d+)/update", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await update_filled_field(
    req.body.survey_field_id,
    req.body.filled_survey_id,
    req.body.answer,
    req.params.filledFieldID
  );
  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// ADMIN
//
router.delete("/:filledFieldID(\\d+)/delete", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_filled_field(req.params.filledFieldID);
  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

// ########################################################################################
module.exports = router;
