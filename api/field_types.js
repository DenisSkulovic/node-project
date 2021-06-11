const express = require("express");
const router = express.Router();
const {
  get_field_type_for_field_type_id,
  get_field_types_list,
  create_field_type,
  update_field_type,
  delete_field_type,
} = require("../database/field_types");

router.get("/field_types/:fieldTypeID(\\d+)/", async function (req, res, next) {
  let result = await get_field_type_for_field_type_id(req.params.fieldTypeID);
  res.json([{ result: result }]);
});

router.get("/field_types/all", async function (req, res, next) {
  let result = await get_field_types_list();
  res.json([{ result: result }]);
});

router.post("/field_types/create", async function (req, res, next) {
  let result = await create_field_type(req.body.name);
  res.json([{ result: result }]);
});

router.put("/field_types/:fieldTypeID(\\d+)/update", function (req, res, next) {
  let result = await update_field_type(req.body.name, req.params.fieldTypeID);
  res.json([{ result: result }]);
});

router.delete(
  "/field_types/:fieldTypeID(\\d+)/delete",
  function (req, res, next) {
    let result = await delete_field_type(req.params.fieldTypeID);
    res.json([{ result: result }]);
  }
);

module.exports = router;
