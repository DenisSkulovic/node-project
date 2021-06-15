const express = require("express");
const router = express.Router();
const {
  getSuccessMessage,
  errorMessage,
  status,
} = require("../../utils/status");
const {
  isPublic_filled_field,
  isOwner_filled_field,
  isSurveyOwner_filled_field,
  get_filled_field_for_filled_field_id,
  get_filled_fields_list_for_filled_survey_id,
  create_filled_field,
  update_filled_field,
  delete_filled_field,
} = require("../../database/filled_fields");
const {
  isPublic_filled_survey,
  isOwner_filled_survey,
  isSurveyOwner_filled_survey,
} = require("../../database/filled_surveys");
const { authenticateAccessToken } = require("../../utils/auth");

//
//
//
//
// ########################################################################################
/**
 * PUBLIC or PRIVATE
 */
router.get("/:filledFieldID(\\d+)/", async function (req, res) {
  let user = authenticateAccessToken(req);

  let result;

  if (
    isPublic_filled_field(req.params.filledFieldID) ||
    isOwner_filled_field(req.params.filledFieldID, user.email) ||
    isSurveyOwner_filled_field(req.params.filledFieldID, user.email) ||
    user.isadmin
  ) {
    result = await get_filled_field_for_filled_field_id(
      req.params.filledSurveyID
    );
  }

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
 * PUBLIC or PRIVATE
 */
router.get("/survey/:filledSurveyID(\\d+)/", async function (req, res) {
  let user = authenticateAccessToken(req);

  let result;

  if (
    isPublic_filled_survey(req.params.filledSurveyID) ||
    isOwner_filled_survey(req.params.filledSurveyID, user.email) ||
    isSurveyOwner_filled_survey(req.params.filledSurveyID, user.email) ||
    user.isadmin
  ) {
    result = await get_filled_fields_list_for_filled_survey_id(
      req.params.filledFieldID,
      req.query.order_by,
      req.query.page,
      req.query.per_page,
      req.query.order
    );
  }

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
 * ADMIN or FILLED SURVEY OWNER
 */
router.post("/create", async function (req, res) {
  let user = authenticateAccessToken(req);

  if (
    !isOwner_filled_survey(req.body.filled_survey_id, user.email) ||
    !user.isadmin
  ) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_filled_field(
    req.body.survey_field_id,
    req.body.filled_survey_id,
    req.body.answer
  );
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
router.put("/:filledFieldID(\\d+)/update", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }
  if (
    !req.body.survey_field_id ||
    !req.body.filled_survey_id ||
    !req.body.answer ||
    !req.params.filledFieldID
  ) {
    return res.status(status["bad"]).end();
  }

  // query
  let result = await update_filled_field(
    req.body.survey_field_id,
    req.body.filled_survey_id,
    req.body.answer,
    req.params.filledFieldID
  );
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
router.delete("/:filledFieldID(\\d+)/delete", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_filled_field(req.params.filledFieldID);
  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

// ########################################################################################
module.exports = router;
