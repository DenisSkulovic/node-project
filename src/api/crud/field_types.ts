import express, { Request, Response } from "express";
const router = express.Router();
import { getSuccessMessage, st } from "../../utils/status";
import { get_field_type_for_field_type_id, get_field_types_list, create_field_type, update_field_type, delete_field_type } from "../../database/field_types";
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
  "/:fieldTypeID(\\d+)/",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);

    // query
    let result = await get_field_type_for_field_type_id(parseInt(req.params["fieldTypeID"]!));

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
router.get("/all", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);
  // query
  let result = await get_field_types_list();

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
 * ADMIN
 */
router.post("/create", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);
  if (!user["isadmin"]) {
    return res.status(st["unauthorized"]!).end();
  }

  // query
  let result = await create_field_type(req.body.name);
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
  "/:fieldTypeID(\\d+)/update",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["isadmin"]) {
      return res.status(st["unauthorized"]!).end();
    }
    if (!req.body.name || !req.params["fieldTypeID"]) {
      return res.status(st["bad"]!).end();
    }

    // query
    let result = await update_field_type(req.body.name, parseInt(req.params["fieldTypeID"]));

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
  "/:fieldTypeID(\\d+)/delete",
  async (req: Request, res: Response) => {
    let user = authenticateAccessToken(req);
    if (!user["isadmin"]) {
      return res.status(st["unauthorized"]!).end();
    }

    // query
    let result = await delete_field_type(parseInt(req.params["fieldTypeID"]!));

    return res
      .status(st["created"]!)
      .json([{ result: result, message: getSuccessMessage(user) }]);
  }
);

// ########################################################################################
module.exports = router;
