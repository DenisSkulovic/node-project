import express, { Request, Response } from "express";
import { LooseObject } from "types";
const router = express.Router();
import {
  getSuccessMessage,
  // errorMessage,
  st
} from "../../utils/status";
import {
  // isPublic_survey_field,
  isOwner_survey_field, get_survey_field_for_survey_field_id,
  // get_survey_fields_list_for_survey_id__all,
  get_survey_fields_list_for_survey_id__public, create_survey_field, update_survey_field
} from "../../database/survey_fields";
import {
  // isPublic_survey,
  isOwner_survey
} from "../../database/surveys";
import { authenticateAccessToken } from "../../utils/auth";

//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get(
  "/:surveyFieldID(\\d+)",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    // query
    let result = await get_survey_field_for_survey_field_id(
      parseInt(req.params["surveyFieldID"]!)
    );

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
 * PUBLIC
 */
router.get(
  "/survey/:surveyID(\\d+)",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    let query: LooseObject = req.query as LooseObject

    let result = await get_survey_fields_list_for_survey_id__public(
      parseInt(req.params["surveyID"]!),
      query["order_by"],
      query["page"],
      query["per_page"],
      query["order"]
    );

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
 * ADMIN or OWNER
 */
router.post("/create",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["email"]) {
      return res.status(st["unauthorized"]!).end();
    }

    let result;

    if (user["isadmin"] || isOwner_survey(req.body.survey_id, user["email"])) {
      result = await create_survey_field(
        req.body.field_type_id,
        req.body.survey_id,
        req.body.title
      );
    } else {
      return res.status(st["unauthorized"]!).end();
    }

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
 * ADMIN or OWNER
 */
router.put(
  "/:surveyFieldID(\\d+)/update",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["email"]) {
      return res.status(st["unauthorized"]!).end();
    }
    if (
      !req.params["surveyFieldID"] ||
      !req.body.survey_field_title ||
      !req.body.survey_field_type_id
    ) {
      return res.status(st["bad"]!).end();
    }

    let result;

    if (
      user["isadmin"] ||
      isOwner_survey_field(parseInt(req.params["surveyFieldID"]!), user["email"])
    ) {
      result = await update_survey_field(
        parseInt(req.params["surveyFieldID"]!),
        req.body.survey_field_title,
        req.body.survey_field_type_id
      );
    } else {
      return res.status(st["unauthorized"]!).end();
    }

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
  "/:surveyFieldID(\\d+)/delete",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["email"]) {
      return res.status(st["unauthorized"]!).end();
    }

    let result;

    if (
      user["isadmin"] ||
      isOwner_survey_field(parseInt(req.params["surveyFieldID"]!), user["email"])
    ) {
      result = await update_survey_field(
        parseInt(req.params["surveyFieldID"]!),
        req.body.survey_field_title,
        req.body.survey_field_type_id
      );
    } else {
      return res.status(st["unauthorized"]!).end();
    }

    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

export default router
