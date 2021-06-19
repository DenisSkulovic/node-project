import express, { Request, Response } from "express";
const router = express.Router();
import { resetDatabase } from "../database/db_reset";
import { authenticateAccessToken } from "../utils/auth";
import { getSuccessMessage, st } from "../utils/status";

//
//
router.get("/reset-database", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);

  if (!user["isadmin"]) {
    return res.status(st["forbidden"]).end();
  }

  let result = await resetDatabase();
  return res
    .status(st["success"]!)
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

export default router;
