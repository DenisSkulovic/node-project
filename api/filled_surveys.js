const express = require("express");
const router = express.Router();
const {
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
} = require("../database/filled_surveys");

router.get(
  "/filled_surveys/:filledSurveyID(\\d+)/",
  async function (req, res, next) {
    let result = await get_filled_survey_for_filled_survey_id(
      req.params.filledSurveyID
    );
    res.json([{ result: result }]);
  }
);

router.get(
  "/filled_surveys/:email(^[w-.]+@([w-]+.)+[w-]{2,4}$)",
  async function (req, res, next) {
    let result = await get_filled_survey_list_for_email(req.params.email);
    res.json([{ result: result }]);
  }
);

router.post(
  "/filled_surveys/:surveyID(\\d+)/create",
  async function (req, res, next) {
    let result = await create_filled_survey_for_survey_id(req.params.surveyID);
    res.json([{ result: result }]);
  }
);

router.delete(
  "/survey_fields/:filledSurveyID(\\d+)/delete",
  function (req, res, next) {
    let result = await delete_filled_survey(req.params.filledSurveyID);
    res.json([{ result: result }]);
  }
);

module.exports = router;
