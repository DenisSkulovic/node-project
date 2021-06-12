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

// ########################################################################################
//
// result depends: PUBLIC, OWNER or ADMIN
//
router.get("/:surveyFieldID(\\d+)/", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  // if not public - user has to be owner or admin
  if (!isPublic_survey_field(req.params.surveyFieldID)) {
    if (
      !isOwner_survey_field(req.params.surveyFieldID, user.email) ||
      !user.isadmin
    ) {
      return res.status(status["unauthorized"]).end();
    }
  }

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

// ########################################################################################
//
// result depends: PUBLIC, OWNER or ADMIN
//
router.get("/:surveyID(\\d+)/", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  // if not public - user has to be owner or admin
  if (!isPublic_survey(req.params.surveyID)) {
    if (!isOwner_survey(req.params.surveyID, user.email) || !user.isadmin) {
      return res.status(status["unauthorized"]).end();
    }
  }

  // if user is admin or requests own surveys
  let result = await get_survey_fields_list_for_survey_id__all(
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

// ########################################################################################
//
// ADMIN or AUTHENTICATED
//
router.post("/create", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (!user.email || !user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_survey_field(
    req.body.field_type_id,
    req.body.survey_id,
    req.body.title
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
// ADMIN or OWNER
//
router.put("/:surveyFieldID(\\d+)/update", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (
    !isOwner_survey_field(req.params.surveyFieldID, user.email) ||
    !user.isadmin
  ) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await update_survey_field(
    req.params.surveyFieldID,
    req.body.survey_field_title,
    req.body.survey_field_type_id
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
// ADMIN or OWNER
//
router.delete("/:surveyFieldID(\\d+)/delete", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (
    !isOwner_survey_field(req.params.surveyFieldID, user.email) ||
    !user.isadmin
  ) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_survey_field(req.params.surveyFieldID);
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
