const express = require("express");
const router = express.Router();
const {
  get_filled_field_for_filled_field_id,
  get_filled_fields_list_for_filled_survey_id,
  create_filled_field,
  update_filled_field,
  delete_filled_field,
} = require("../database/filled_fields");

router.get(
  "/filled_fields/:filledFieldID(\\d+)/",
  async function (req, res, next) {
    let result = await get_filled_field_for_filled_field_id(
      req.params.filledFieldID
    );
    res.json([{ result: result }]);
  }
);

router.get(
  "/filled_fields/:filledSurveyID(\\d+)/",
  async function (req, res, next) {
    let result = await get_filled_fields_list_for_filled_survey_id(
      req.params.filledSurveyID
    );
    res.json([{ result: result }]);
  }
);

router.post("/filled_fields/create", async function (req, res, next) {
  let result = await create_filled_field(
    req.body.survey_field_id,
    req.body.filled_survey_id,
    req.body.answer
  );
  res.json([{ result: result }]);
});

router.put(
  "/filled_fields/:filledFieldID(\\d+)/update",
  function (req, res, next) {
    let result = await update_filled_field(
      req.body.survey_field_id,
      req.body.filled_survey_id,
      req.body.answer,
      req.params.filledFieldID
    );
    res.json([{ result: result }]);
  }
);

router.delete(
  "/filled_fields/:filledFieldID(\\d+)/delete",
  function (req, res, next) {
    let result = await delete_filled_field(req.params.filledFieldID);
    res.json([{ result: result }]);
  }
);

module.exports = router;
