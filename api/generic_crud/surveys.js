const express = require("express");
const router = express.Router();
const { successMessage, errorMessage, status } = require("../../utils/status");
const {
  isPublic_survey,
  isOwner_survey,
  get_survey_for_survey_id,
  get_survey_list_for_email__all,
  get_survey_list_for_email__public,
  create_survey_for_email,
  update_survey_for_survey_id,
  delete_survey_by_survey_id,
} = require("../../database/surveys");

// ########################################################################################
//
// result depends: PUBLIC, OWNER or ADMIN
//
router.get("/:surveyID(\\d+)/", async function (req, res, next) {
  // if not public - only send to owner or admin
  if (!isPublic_survey(req.params.surveyID)) {
    const accessToken = req.header("AccessToken");
    let user = authenticateAccessToken(accessToken);
    if (!isOwner_survey(req.params.surveyID, user.email) || !user.isadmin) {
      return res.status(status["unauthorized"]).end();
    }
  }

  // query
  let result = await get_survey_for_survey_id(req.params.surveyID);
  if (result) {
    //response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// result depends: PUBLIC, OWNER or ADMIN
//
router.get("/for-email", async function (req, res, next) {
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);

  let result;
  // if user is allowed to access only public surveys
  if (user.email !== req.query.email || !user.isadmin) {
    result = await get_survey_list_for_email__public(
      req.query.email,
      req.query.order_by,
      req.query.page,
      req.query.per_page
    );
  }

  // if user is admin or requests own surveys
  if (user.isadmin || user.email === req.query.email) {
    result = await get_survey_list_for_email__all(
      req.query.email,
      req.query.order_by,
      req.query.page,
      req.query.per_page
    );
  }

  // response
  if (result) {
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

// ########################################################################################
//
// ADMIN or AUTHENTICATED
//
router.post("/create", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (!user.email || !user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await create_survey_for_email(user.email, req.body.title);
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
//
// ADMIN or OWNER
//
router.put("/:surveyID(\\d+)/update", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (!isOwner_survey(req.params.surveyID, user.email) || !user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await update_survey_for_survey_id(
    req.body.survey_title,
    req.body.public,
    req.params.surveyID
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

// ########################################################################################
//
// ADMIN or OWNER
//
router.delete("/:surveyID(\\d+)/delete", async function (req, res, next) {
  // auth
  const accessToken = req.header("AccessToken");
  let user = authenticateAccessToken(accessToken);
  if (!isOwner_survey(req.params.surveyID, user.email) || !user.isadmin) {
    return res.status(status["unauthorized"]).end();
  }

  // query
  let result = await delete_survey_by_survey_id(req.params.surveyID);
  if (result) {
    // response
    return res
      .status(status["success"])
      .json([{ result: result, message: successMessage }]);
  } else {
    return res.status(status["notfound"]).end();
  }
});

module.exports = router;
