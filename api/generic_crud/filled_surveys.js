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
router.get(
  "/:email(([w.-]+)@([w-]+)((.(w){2,3})+))",
  async function (req, res, next) {
    // query
    let result = await get_filled_survey_list_for_email(req.params.email);
    if (result) {
      // response
      res
        .status(status["success"])
        .json([{ result: result, message: successMessage }]);
    } else {
      res.status(status["notfound"]).end();
    }
  }
);

// ########################################################################################
//
// ADMIN
//
router.post("/:surveyID(\\d+)/create", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_filled_survey_for_survey_id(req.params.surveyID);
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
router.delete("/:filledSurveyID(\\d+)/delete", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  console.log("user.isadmin", user.isadmin);
  if (!user || user.isadmin === false) {
    res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_filled_survey(req.params.filledSurveyID);
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
