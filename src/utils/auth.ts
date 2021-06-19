import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { TokenInterface, LooseObject } from '../types/types'

declare var process: {
  env: {
    SECRET: Secret;
    REFRESH_SECRET: Secret;
    TOKEN_EXPIRY: string;
  }
}

//
//
//
//
// ###################################################################################
/**
 * Authenticate request object. The request has to have an "AccessToken" header.
 * Returns a deciphered token with email, admin status, etc.
 */
export const authenticateAccessToken = (req: any): LooseObject => {
  const accessToken = req.headers.get("AccessToken");
  if (!accessToken) {
    console.log("No AccessToken");
    return {};
  }

  let result: LooseObject = {}
  try {
    let decoded: JwtPayload | string = jwt.verify(accessToken, process.env["SECRET"]);
    result["email"] = (decoded as TokenInterface).user["email"]
    result["isadmin"] = (decoded as TokenInterface).user["isadmin"]
  } catch (err) {
    console.log(err);
  }

  if (Object.keys(result).length === 0) {
    result["email"] = "";
    result["isadmin"] = false;
  }
  return result;
}

//
//
//
//
// ###################################################################################
/**
 * Authenticate request object. The request has to have a "RefreshToken" header.
 * Returns a deciphered token with email, admin status, etc.
 */
export const authenticateRefreshToken = (req: any): LooseObject => {
  const refreshToken = req.headers.get("RefreshToken");
  if (!refreshToken) {
    return {};
  }

  let result: LooseObject = {}
  try {
    let decoded: JwtPayload | string = jwt.verify(refreshToken, process.env["REFRESH_SECRET"]);
    result["email"] = (decoded as TokenInterface).user["email"]
    result["isadmin"] = (decoded as TokenInterface).user["isadmin"]
  } catch (err) {
    console.log(err);
  }

  if (Object.keys(result).length === 0) {
    result["email"] = "";
    result["isadmin"] = false;
  }
  return result;
}

//
//
//
//
// ###################################################################################
/**
 * Get an AccessToken for the provided data. Assigns an expiry to the token.
 */
export const generateAccessToken = (data: LooseObject) => {
  return jwt.sign(data, process.env["SECRET"], {
    expiresIn: process.env["TOKEN_EXPIRY"],
  });
}

//
//
//
//
// ###################################################################################
/**
 * Get a RefreshToken for the provided data. Assigns an expiry to the token.
 */
export const generateRefreshToken = (data: LooseObject) => {
  return jwt.sign(data, process.env["REFRESH_SECRET"]);
}
