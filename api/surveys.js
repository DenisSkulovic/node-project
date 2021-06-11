const express = require("express");
const router = express.Router();
const url = require("url");
const {
  get_survey_for_survey_id,
  get_survey_list_for_email,
  create_survey_for_email,
  update_survey_title_for_survey_id,
  delete_survey_by_survey_id,
} = require("../database/surveys");

router.get("/surveys/:surveyID(\\d+)/", async function (req, res, next) {
  let result = await get_survey_for_survey_id(req.params.surveyID);
  res.json([{ result: result }]);
});

router.get(
  "/surveys/:email(^[w-.]+@([w-]+.)+[w-]{2,4}$)",
  async function (req, res, next) {
    let result = await get_survey_list_for_email(req.params.email);
    res.json([{ result: result }]);
  }
);

router.post(
  "/surveys/:email(^[w-.]+@([w-]+.)+[w-]{2,4}$)/create",
  async function (req, res, next) {
    let result = await create_survey_for_email(
      req.body.email,
      req.body.survey_title
    );
    res.json([{ result: result }]);
  }
);

router.put("/surveys/:surveyID(\\d+)/update", function (req, res, next) {
  let result = await update_survey_title_for_survey_id(
    req.body.survey_title,
    req.params.surveyID
  );
  res.json([{ result: result }]);
});

router.delete("/surveys/:surveyID(\\d+)/delete", function (req, res, next) {
  let result = await delete_survey_by_survey_id(req.params.surveyID);
  res.json([{ result: result }]);
});

module.exports = router;
