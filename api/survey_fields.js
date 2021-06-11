const express = require("express");
const router = express.Router();
const {
  get_survey_field_for_survey_field_id,
  get_survey_fields_list_for_survey_id,
  create_survey_field,
  update_survey_field,
  delete_survey_field,
} = require("../database/survey_fields");

router.get("/:surveyFieldID(\\d+)/", async function (req, res, next) {
  let result = await get_survey_field_for_survey_field_id(
    req.params.surveyFieldID
  );
  res.json([{ result: result }]);
});

router.get("/:surveyID(\\d+)/", async function (req, res, next) {
  let result = await get_survey_fields_list_for_survey_id(req.params.surveyID);
  res.json([{ result: result }]);
});

router.post("/create", async function (req, res, next) {
  let result = await create_survey_field(
    req.body.field_type_id,
    req.body.survey_id,
    req.body.title
  );
  res.json([{ result: result }]);
});

router.put("/:surveyFieldID(\\d+)/update", async function (req, res, next) {
  let result = await update_survey_field(
    req.params.surveyFieldID,
    req.body.survey_field_title,
    req.body.survey_field_type_id
  );
  res.json([{ result: result }]);
});

router.delete("/:surveyFieldID(\\d+)/delete", async function (req, res, next) {
  let result = await delete_survey_field(req.params.surveyFieldID);
  res.json([{ result: result }]);
});

module.exports = router;
