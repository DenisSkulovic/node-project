import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateAccessToken, authenticateRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/auth";
import { getSuccessMessage, st } from "../utils/status";
import { getUserPasswordAndAdminStatus, register, change_password } from "../database/auth";

// https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js
// has to be a let to apply a filter function; of course it's possible to do it differently and have a const
let refreshTokens: string[] = [];

//
//
//
//
// ###############################################################
router.post("/refreshtoken", async (req: Request, res: Response) => {
  if (!req.body.refreshToken) {
    return res.status(st["bad"]!).end();
  }
  if (!refreshTokens.includes(req.body.refreshToken)) {
    return res.status(st["notfound"]).end();
  }

  let user = authenticateRefreshToken(req.body.refreshToken);

  if (!user["email"]) {
    return res.status(st["forbidden"]).end();
  }

  let result = await getUserPasswordAndAdminStatus(user["email"]);
  let isadmin = result.rows[0]["isadmin"];

  const accessToken = generateAccessToken({
    email: user["email"],
    isadmin: isadmin,
  });

  let message = getSuccessMessage(user);
  message["isAuthenticated"] = true;
  message["isAdmin"] = isadmin ? true : false;
  return res.status(st["success"]!).json({
    accessToken: accessToken,
    message: message,
  });
});

//
//
//
//
// ###############################################################
router.post("/login", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);
  let message = getSuccessMessage(user);

  if (!req.body.email || !req.body.password) {
    return res.status(st["bad"]!).end();
  }

  let result = await getUserPasswordAndAdminStatus(req.body.email);

  if (req.body.password != result.rows[0]["password"]) {
    return res.status(st["error"]).end();
  }

  let isadmin = result.rows[0]["isadmin"];

  const accessToken = generateAccessToken({
    email: req.body.email,
    isadmin: isadmin,
  });

  const refreshToken = generateRefreshToken({
    email: req.body.email,
    isadmin: isadmin,
  });

  refreshTokens.push(refreshToken);

  console.log("isadmin", isadmin);
  message["isAuthenticated"] = true;
  message["isAdmin"] = isadmin ? true : false;
  return res.status(st["success"]!).json([
    {
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: message,
    },
  ]);
});

//
//
//
//
// ###############################################################
router.post("/register", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);
  let message = getSuccessMessage(user);

  if (!req.body.email || !req.body.password) {
    return res.status(st["bad"]!).end();
  }

  let result = await register(
    req.body.email,
    req.body.password,
    user["isadmin"] && req.body.isadmin ? req.body.isadmin : false
  );

  if (!result) {
    return res.status(st["error"]).end();
  }

  const accessToken = generateAccessToken({
    email: req.body.email,
    isadmin: user["isadmin"] && req.body.isadmin ? req.body.isadmin : false,
  });
  const refreshToken = generateRefreshToken({
    email: req.body.email,
    isadmin: user["isadmin"] && req.body.isadmin ? req.body.isadmin : false,
  });
  refreshTokens.push(refreshToken);

  message["isAuthenticated"] = true;
  message["isAdmin"] = user["isadmin"] ? true : false;
  return res.status(st["created"]!).json([
    {
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: message,
    },
  ]);
});

//
//
//
//
// ###############################################################
router.post("/logout", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);
  let message = getSuccessMessage(user);

  // better to move this refresh tokens list into the database (later)
  refreshTokens = refreshTokens.filter((t) => t !== req.body.refreshToken);

  message["isAuthenticated"] = false;
  message["isAdmin"] = false;
  return res.status(st["success"]!).json([{ message: message }]);
});

//
//
//
//
// ###############################################################
router.post("/change-password", async (req: Request, res: Response) => {
  let user = authenticateAccessToken(req);
  if (!user["email"]) {
    return res.status(st["unauthorized"]!.end());
  }
  if (!req.body.email || !req.body.password) {
    return res.status(st["bad"]!).end();
  }

  // verify entered email & password
  let userData = await getUserPasswordAndAdminStatus(req.body.email);
  if (
    !user["isadmin"] &&
    (`${req.body.password}` !== `${userData.rows[0]["password"]}` ||
      `${user["email"]}` !== `${req.body.email}`)
  ) {
    return res.status(st["unauthorized"]!).end();
  }

  let result = await change_password(
    user["isadmin"] ? req.body.email : user["email"],
    req.body.newPassword
  );

  return res
    .status(st["created"]!)
    .json([{ result: result, message: getSuccessMessage(user) }]);
});

//
//
//
//
// ###############################################################
export default router;
