"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.st = exports.getSuccessMessage = void 0;
/**
 * Get success message for response, containing user authentication status.
 */
var getSuccessMessage = function (user) {
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
};
exports.getSuccessMessage = getSuccessMessage;
//
//
//
//
// ###################################################################################
exports.st = {
    "success": 200,
    "error": 500,
    "notfound": 404,
    "unauthorized": 401,
    "forbidden": 403,
    "conflict": 409,
    "created": 201,
    "bad": 400,
    "nocontent": 204,
};
