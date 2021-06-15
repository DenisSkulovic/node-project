const express = require("express");
const router = express.Router();
const {
  getSuccessMessage,
  // errorMessage,
  status,
} = require("../../utils/status");
const {
  isOwner_survey,
  isPublic_survey,
  get_survey_for_survey_id__all,
  // get_survey_for_survey_id__public,
  // get_survey_for_survey_id__public_or_owner,
  // get_survey_for_survey_id__owner,
  get_survey_list_for_email__all,
  get_survey_list_for_email__public,
  // get_survey_list_for_email__public_or_owner,
  // get_survey_list_for_email__owner,
  get_survey_list__all,
  get_survey_list__public,
  // get_survey_list__public_or_owner,
  get_survey_list__owner,
  create_survey_for_email,
  update_survey_for_survey_id,
  delete_survey_by_survey_id,
} = require("../../database/surveys");
const { authenticateAccessToken } = require("../../utils/auth");

//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/:surveyID(\\d+)", async function (req, res) {
  let user = authenticateAccessToken(req);
  let result = await get_survey_for_survey_id__all(req.params.surveyID);

  return res
    .status(status["success"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/all", async function (req, res) {
  let user = authenticateAccessToken(req);

  let result;
  switch (req.query.type) {
    case "owner":
      if (user.email) {
        result = await get_survey_list__owner(
          user.email,
          req.query.order_by,
          req.query.page,
          req.query.per_page,
          req.query.order
        );
      }
      break;
    case "public":
      result = await get_survey_list__public(
        req.query.order_by,
        req.query.page,
        req.query.per_page,
        req.query.order
      );
      break;
    default:
      result = await get_survey_list__all(
        req.query.order_by,
        req.query.page,
        req.query.per_page,
        req.query.order
      );
  }

  return res
    .status(status["success"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/for-email", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!req.query.email) {
    return res.status(status["bad"]).end();
  }

  let result;

  if (req.query.type === "public") {
    result = await get_survey_list_for_email__public(
      req.query.email,
      req.query.order_by,
      req.query.page,
      req.query.per_page,
      req.query.order
    );
  } else {
    result = await get_survey_list_for_email__all(
      req.query.email,
      req.query.order_by,
      req.query.page,
      req.query.per_page,
      req.query.order
    );
  }

  return res
    .status(status["success"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
// ########################################################################################
/**
 * ADMIN or AUTHENTICATED
 */
router.post("/create", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!user.email) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result;
  // if user is admin and supplied email in query
  if (user.isadmin && req.query.email) {
    result = await create_survey_for_email(req.query.email, req.body.title);
    // if user not admin, but authenticated, create for won email
  } else {
    result = await create_survey_for_email(user.email, req.body.title);
  }
  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.put("/:surveyID(\\d+)/update", async function (req, res) {
  let user = authenticateAccessToken(req);
  if (!req.body.survey_title || !req.body.public || !req.params.surveyID) {
    return res.status(status["bad"]).end();
  }

  // only allow owners or admins to update
  if (!isOwner_survey(req.params.surveyID, user.email) || !user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // prevent attempt to change survey from private to public
  if (req.body.public === true && !isPublic_survey(req.params.surveyID)) {
    return res.status(status["forbidden"]).end();
  }

  // query
  let result = await update_survey_for_survey_id(
    req.body.survey_title,
    req.body.public,
    req.params.surveyID
  );

  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.delete("/:surveyID(\\d+)/delete", async function (req, res) {
  let user = authenticateAccessToken(req);

  if (!isOwner_survey(req.params.surveyID, user.email) || !user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_survey_by_survey_id(req.params.surveyID);
  return res
    .status(status["created"])
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

module.exports = router;
