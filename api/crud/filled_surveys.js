const express = require("express");
const router = express.Router();
const { successMessage, errorMessage, status } = require("../../utils/status");
const {
  isPublic_filled_survey,
  isOwner_filled_survey,
  isSurveyOwner_filled_survey,
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email__all,
  get_filled_survey_list_for_email__filledSurveyOwner,
  get_filled_survey_list_for_email__surveyOwner,
  get_filled_survey_list_for_email__public,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
} = require("../../database/filled_surveys");
const { authenticateAccessToken } = require("../../utils/auth");

//
//
//
// ########################################################################################
/**
 * PUBLIC or PRIVATE
 */
router.get("/:filledSurveyID(\\d+)/", async function (req, res) {
  let user = authenticateAccessToken(req);

  let result;

  if (
    isPublic_filled_survey(req.params.filledSurveyID) ||
    isSurveyOwner_filled_survey(req.params.filledSurveyID, user.email) ||
    user.isadmin
  ) {
    result = await get_filled_survey_for_filled_survey_id(
      req.params.filledSurveyID
    );
  }

  return res
    .status(status["success"])
    .json([{ result: result, message: successMessage }]);
});

//
//
//
// ########################################################################################
//
// ADMIN, PUBLIC or PRIVATE
//
router.get("/for-email/", async function (req, res) {
  let user = authenticateAccessToken(req);

  let result;

  if (!req.query.email) {
    return res.status(status["bad"]).end();
  }

  switch (req.query.type) {
    case "surveyOwner":
      if (req.query.email === user.email || user.isadmin) {
        result = await get_filled_survey_list_for_email__surveyOwner(
          req.query.email
        );
      }
      break;
    case "filledSurveyOwner":
      if (req.query.email === user.email || user.isadmin) {
        result = await get_filled_survey_list_for_email__filledSurveyOwner(
          req.query.email
        );
      }
      break;
    case "all":
      if (user.isadmin) {
        result = await get_filled_survey_list_for_email__all(req.query.email);
      }
      break;
    case "public":
      result = await get_filled_survey_list_for_email__public(req.query.email);
      break;
    default:
      result = await get_filled_survey_list_for_email__public(req.query.email);
  }

  return res
    .status(status["success"])
    .json([{ result: result, message: successMessage }]);
});

//
//
//
// ########################################################################################
//
// PUBLIC
//
router.post("/:surveyID(\\d+)/create", async function (req, res) {
  let user = authenticateAccessToken(req);

  let result = await create_filled_survey_for_survey_id(
    req.params.surveyID,
    user.email
  );

  return res
    .status(status["success"])
    .json([{ result: result, message: successMessage }]);
});

//
//
//
// ########################################################################################
//
// ADMIN or OWNER
//
router.delete("/:filledSurveyID(\\d+)/delete", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (
    !isOwner_filled_survey(req.params.filledSurveyID, user.email) ||
    !user.isadmin
  ) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_filled_survey(req.params.filledSurveyID);
  return res
    .status(status["success"])
    .json([{ result: result, message: successMessage }]);
});

// ########################################################################################
module.exports = router;
