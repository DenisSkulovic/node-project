const express = require("express");
const router = express.Router();
const { successMessage, errorMessage, status } = require("../../utils/status");
const {
  isPublic_filled_survey,
  isOwner_filled_survey,
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
} = require("../../database/filled_surveys");

//
//
//
// ########################################################################################
//
// PUBLIC
//
router.get("/:filledSurveyID(\\d+)/", async function (req, res, next) {
  // query
  let result = await get_filled_survey_for_filled_survey_id(
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

//
//
//
// ########################################################################################
//
// PUBLIC
//
router.get(
  "/:email(([w.-]+)@([w-]+)((.(w){2,3})+))",
  async function (req, res, next) {
    // query
    let result = await get_filled_survey_list_for_email(req.params.email);
    if (result) {
      // response
      return res
        .status(status["success"])
        .json([{ result: result, message: successMessage }]);
    } else {
      return res.status(status["notfound"]).end();
    }
  }
);

//
//
//
// ########################################################################################
//
// PUBLIC
//
router.post("/:surveyID(\\d+)/create", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);

  // query
  let result = await create_filled_survey_for_survey_id(
    req.params.surveyID,
    user.email
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
// ########################################################################################
//
// ADMIN or OWNER
//
router.delete("/:filledSurveyID(\\d+)/delete", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (
    !isOwner_filled_survey(req.params.filledSurveyID, user.email) ||
    !user.isadmin
  ) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_filled_survey(req.params.filledSurveyID);
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
