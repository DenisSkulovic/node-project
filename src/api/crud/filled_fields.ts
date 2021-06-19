import express, { Request, Response } from "express";
import { LooseObject } from "types";
const router = express.Router();
import { getSuccessMessage, st } from "../../utils/status";
import { isPublic_filled_field, isOwner_filled_field, isSurveyOwner_filled_field, get_filled_field_for_filled_field_id, get_filled_fields_list_for_filled_survey_id, create_filled_field, update_filled_field, delete_filled_field } from "../../database/filled_fields";
import { isPublic_filled_survey, isOwner_filled_survey, isSurveyOwner_filled_survey } from "../../database/filled_surveys";
import { authenticateAccessToken } from "../../utils/auth";

//
//
//
//
// ########################################################################################
/**
 * PUBLIC or PRIVATE
 */
router.get(
  "/:filledFieldID(\\d+)/",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    let result;

    if (
      isPublic_filled_field(parseInt(req.params["filledSurveyID"]!)) ||
      isOwner_filled_field(parseInt(req.params["filledSurveyID"]!), user["email"]) ||
      isSurveyOwner_filled_field(parseInt(req.params["filledSurveyID"]!), user["email"]) ||
      user["isadmin"]
    ) {
      result = await get_filled_field_for_filled_field_id(
        parseInt(req.params["filledSurveyID"]!)
      );
    }

    return res
      .status(st["success"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

//
//
//
//
// ########################################################################################
/**
 * PUBLIC or PRIVATE
 */
router.get(
  "/survey/:filledSurveyID(\\d+)/",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    let query: LooseObject = req.query as LooseObject

    let result;

    if (
      isPublic_filled_survey(parseInt(req.params["filledSurveyID"]!)) ||
      isOwner_filled_survey(parseInt(req.params["filledSurveyID"]!), user["email"]) ||
      isSurveyOwner_filled_survey(parseInt(req.params["filledSurveyID"]!), user["email"]) ||
      user["isadmin"]
    ) {
      result = await get_filled_fields_list_for_filled_survey_id(
        parseInt(req.params["filledFieldID"]!),
        query["order_by"],
        query["page"],
        query["per_page"],
        query["order"]
      );
    }

    return res
      .status(st["success"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

//
//
//
//
// ########################################################################################
/**
 * ADMIN or FILLED SURVEY OWNER
 */
router.post("/create", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);

  if (
    !isOwner_filled_survey(req.body.filled_survey_id, user["email"]) ||
    !user["isadmin"]
  ) {
    return res.status(st["unauthorized"]!).end();
  }

  // query
  let result = await create_filled_field(
    req.body.survey_field_id,
    req.body.filled_survey_id,
    req.body.answer
  );
  return res
    .status(st["created"]!)
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ########################################################################################
/**
 * ADMIN
 */
router.put(
  "/:filledFieldID(\\d+)/update",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["isadmin"]) {
      return res.status(st["unauthorized"]!).end();
    }
    if (
      !req.body.survey_field_id ||
      !req.body.filled_survey_id ||
      !req.body.answer ||
      !req.params["filledFieldID"]
    ) {
      return res.status(st["bad"]!).end();
    }

    // query
    let result = await update_filled_field(
      req.body.survey_field_id,
      req.body.filled_survey_id,
      req.body.answer,
      parseInt(req.params["filledFieldID"])
    );
    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

//
//
//
//
// ########################################################################################
/**
 * ADMIN
 */
router.delete(
  "/:filledFieldID(\\d+)/delete",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["isadmin"]) {
      return res.status(st["unauthorized"]!).end();
    }

    // query
    let result = await delete_filled_field(parseInt(req.params["filledFieldID"]!));
    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

// ########################################################################################
export default router
