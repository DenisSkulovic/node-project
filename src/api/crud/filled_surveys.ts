import express, { Request, Response } from "express";
const router = express.Router();
import {
  getSuccessMessage,
  st
} from "../../utils/status";
import { isPublic_filled_survey, isOwner_filled_survey, isSurveyOwner_filled_survey, get_filled_survey_for_filled_survey_id, get_filled_survey_list_for_email__all, get_filled_survey_list_for_email__filledSurveyOwner, get_filled_survey_list_for_email__surveyOwner, get_filled_survey_list_for_email__public, create_filled_survey_for_survey_id, delete_filled_survey } from "../../database/filled_surveys";
import { authenticateAccessToken } from "../../utils/auth";
import { LooseObject } from "types";

//
//
//
//
// ########################################################################################
/**
 * PUBLIC or PRIVATE
 */
router.get(
  "/:filledSurveyID(\\d+)/",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    let result;

    if (
      isPublic_filled_survey(parseInt(req.params["filledSurveyID"]!)) ||
      isSurveyOwner_filled_survey(parseInt(req.params["filledSurveyID"]!), user["email"]) ||
      user["isadmin"]
    ) {
      result = await get_filled_survey_for_filled_survey_id(
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
 * ADMIN, PUBLIC or PRIVATE
 */
router.get("/for-email/",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    let query: LooseObject = req.query as LooseObject

    let result;

    if (!query["email"]) {
      return res.status(st["bad"]!).end();
    }

    switch (req.params["type"]) {
      case "surveyOwner":
        if (query["email"] === user["email"] || user["isadmin"]) {
          result = await get_filled_survey_list_for_email__surveyOwner(
            query["email"]!
          );
        }
        break;
      case "filledSurveyOwner":
        if (query["email"] === user["email"] || user["isadmin"]) {
          result = await get_filled_survey_list_for_email__filledSurveyOwner(
            query["email"]
          );
        }
        break;
      case "all":
        if (user["isadmin"]) {
          result = await get_filled_survey_list_for_email__all(query["email"]);
        }
        break;
      case "public":
        result = await get_filled_survey_list_for_email__public(query["email"]);
        break;
      default:
        result = await get_filled_survey_list_for_email__public(query["email"]);
    }

    return res
      .status(st["success"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  });

//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.post(
  "/:surveyID(\\d+)/create",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    let result = await create_filled_survey_for_survey_id(
      parseInt(req.params["surveyID"]!),
      user["email"]
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
 * ADMIN or OWNER
 */
router.delete(
  "/:filledSurveyID(\\d+)/delete",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (
      !isOwner_filled_survey(parseInt(req.params["filledSurveyID"]!), user["email"]) ||
      !user["isadmin"]
    ) {
      return res.status(st["unauthorized"]!).end();
    }

    // query
    let result = await delete_filled_survey(parseInt(req.params["filledSurveyID"]!));
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
export default router
