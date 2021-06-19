import { LooseObject } from "types";

/**
 * Get success message for response, containing user authentication status.
 */
export const getSuccessMessage = (user: LooseObject | undefined): LooseObject => {
  // anonymous
  if (!user) {
    return {
      status: "success",
      isAuthenticated: false,
      isAdmin: false,
    };
  }
  // authenticated
  if (!user["isadmin"]) {
    return {
      status: "success",
      isAuthenticated: true,
      isAdmin: false,
    };
  }
  // admin
  return {
    status: "success",
    isAuthenticated: true,
    isAdmin: true,
  };
}


//
//
//
//
// ###################################################################################
export const st: LooseObject = {
  "success": 200,
  "error": 500,
  "notfound": 404,
  "unauthorized": 401,
  "forbidden": 403,
  "conflict": 409,
  "created": 201,
  "bad": 400,
  "nocontent": 204,
}

