const express = require("express");
const router = express.Router();
const { successMessage, errorMessage, status } = require("../../utils/status");
const {
  isPublic_survey_field,
  isOwner_survey_field,
  get_survey_field_for_survey_field_id,
  get_survey_fields_list_for_survey_id__all,
  get_survey_fields_list_for_survey_id__public,
  create_survey_field,
  update_survey_field,
  delete_survey_field,
} = require("../../database/survey_fields");
const { isPublic_survey, isOwner_survey } = require("../../database/surveys");

//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/:surveyFieldID(\\d+)/", async function (req, res) {
  // query
  let result = await get_survey_field_for_survey_field_id(
    req.params.surveyFieldID
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

//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/survey/:surveyID(\\d+)/", async function (req, res) {
  let result = await get_survey_fields_list_for_survey_id__public(
    req.params.surveyID,
    req.query.order_by,
    req.query.page,
    req.query.per_page
  );

  // response
  if (result) {
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.post("/create", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.email) {
    return res.status(status["unauthorized"]).end();
  }

  let result;

  if (user.isadmin || isOwner_survey(req.body.survey_id, user.email)) {
    result = await create_survey_field(
      req.body.field_type_id,
      req.body.survey_id,
      req.body.title
    );
  } else {
    return res.status(status["unauthorized"]).end();
  }

  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.put("/:surveyFieldID(\\d+)/update", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.email) {
    return res.status(status["unauthorized"]).end();
  }

  let result;

  if (
    user.isadmin ||
    isOwner_survey_field(req.params.surveyFieldID, user.email)
  ) {
    result = await update_survey_field(
      req.params.surveyFieldID,
      req.body.survey_field_title,
      req.body.survey_field_type_id
    );
  } else {
    return res.status(status["unauthorized"]).end();
  }

  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.delete("/:surveyFieldID(\\d+)/delete", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.email) {
    return res.status(status["unauthorized"]).end();
  }

  let result;

  if (
    user.isadmin ||
    isOwner_survey_field(req.params.surveyFieldID, user.email)
  ) {
    result = await update_survey_field(
      req.params.surveyFieldID,
      req.body.survey_field_title,
      req.body.survey_field_type_id
    );
  } else {
    return res.status(status["unauthorized"]).end();
  }

  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

module.exports = router;
