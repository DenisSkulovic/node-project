import express, { Request, Response } from "express";
import { LooseObject } from "types";
const router = express.Router();
import {
  getSuccessMessage,
  // errorMessage,
  st
} from "../../utils/status";
import {
  isOwner_survey, isPublic_survey, get_survey_for_survey_id__all,
  // get_survey_for_survey_id__public,
  // get_survey_for_survey_id__public_or_owner,
  // get_survey_for_survey_id__owner,
  get_survey_list_for_email__all, get_survey_list_for_email__public,
  // get_survey_list_for_email__public_or_owner,
  // get_survey_list_for_email__owner,
  get_survey_list__all, get_survey_list__public,
  // get_survey_list__public_or_owner,
  get_survey_list__owner, create_survey_for_email, update_survey_for_survey_id, delete_survey_by_survey_id
} from "../../database/surveys";
import { authenticateAccessToken } from "../../utils/auth";

//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/:surveyID(\\d+)",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    let result = await get_survey_for_survey_id__all(parseInt(req.params["surveyID"]!));

    return res
      .status(st["success"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  });

//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/all",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    let query: LooseObject = req.query as LooseObject

    let result;
    switch (req.params["type"]) {
      case "owner":
        if (user["email"]) {
          result = await get_survey_list__owner(
            user["email"],
            query["order_by"],
            parseInt(query["page"]),
            parseInt(query["per_page"]),
            query["order"]
          );
        }
        break;
      case "public":
        result = await get_survey_list__public(
          query["order_by"],
          parseInt(query["page"]!),
          parseInt(query["per_page"]!),
          query["order"]
        );
        break;
      default:
        result = await get_survey_list__all(
          query["order_by"],
          query["page"],
          query["per_page"],
          query["order"]
        );
    }

    return res
      .status(st["success"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  });

//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.get("/for-email",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    let query: LooseObject = req.query as LooseObject

    if (!query["email"]) {
      return res.status(st["bad"]!).end();
    }

    let result;

    if (req.params["type"] === "public") {
      result = await get_survey_list_for_email__public(
        query["email"],
        query["order_by"],
        query["page"],
        query["per_page"],
        query["order"]
      );
    } else {
      result = await get_survey_list_for_email__all(
        query["email"],
        query["order_by"],
        query["page"],
        query["per_page"],
        query["order"]
      );
    }

    return res
      .status(st["success"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  });

//
//
//
// ########################################################################################
/**
 * ADMIN or AUTHENTICATED
 */
router.post("/create",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    let query: LooseObject = req.query as LooseObject
    if (!user["email"]) {
      return res.status(st["unauthorized"]!).end();
    }

    // query
    let result;
    // if user is admin and supplied email in query
    if (user["isadmin"] && query["email"]) {
      result = await create_survey_for_email(query["email"], req.body.title);
      // if user not admin, but authenticated, create for won email
    } else {
      result = await create_survey_for_email(user["email"], req.body.title);
    }
    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  });

//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.put(
  "/:surveyID(\\d+)/update",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!req.body.survey_title || !req.body.public || !req.params["surveyID"]) {
      return res.status(st["bad"]!).end();
    }

    // only allow owners or admins to update
    if (!isOwner_survey(parseInt(req.params["surveyID"]!), user["email"]) || !user["isadmin"]) {
      return res.status(st["unauthorized"]!).end();
    }

    // prevent attempt to change survey from private to public
    if (
      req.body.public === true &&
      !isPublic_survey(parseInt(req.params["surveyID"]!)) &&
      !user["isadmin"]
    ) {
      return res.status(st["forbidden"]).end();
    }

    // query
    let result = await update_survey_for_survey_id(
      req.body.survey_title,
      req.body.public,
      req.params["surveyID"]
    );

    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

//
//
//
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.delete(
  "/:surveyID(\\d+)/delete",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    if (!isOwner_survey(parseInt(req.params["surveyID"]!), user["email"]) || !user["isadmin"]) {
      return res.status(st["unauthorized"]!).end();
    }

    // query
    let result = await delete_survey_by_survey_id(parseInt(req.params["surveyID"]!));
    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

export default router
