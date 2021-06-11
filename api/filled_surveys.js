const express = require("express");
const router = express.Router();
const {
  get_filled_survey_for_filled_survey_id,
  get_filled_survey_list_for_email,
  create_filled_survey_for_survey_id,
  delete_filled_survey,
} = require("../database/filled_surveys");

router.get("/:filledSurveyID(\\d+)/", async function (req, res, next) {
  let result = await get_filled_survey_for_filled_survey_id(
    req.params.filledSurveyID
  );
  res.json([{ result: result }]);
});

router.get(
  "/:email(([w.-]+)@([w-]+)((.(w){2,3})+))",
  async function (req, res, next) {
    let result = await get_filled_survey_list_for_email(req.params.email);
    res.json([{ result: result }]);
  }
);

router.post("/:surveyID(\\d+)/create", async function (req, res, next) {
  let result = await create_filled_survey_for_survey_id(req.params.surveyID);
  res.json([{ result: result }]);
});

router.delete("/:filledSurveyID(\\d+)/delete", async function (req, res, next) {
  let result = await delete_filled_survey(req.params.filledSurveyID);
  res.json([{ result: result }]);
});

module.exports = router;
