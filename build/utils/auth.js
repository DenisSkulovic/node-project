"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.authenticateRefreshToken = exports.authenticateAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//
//
//
//
// ###################################################################################
/**
 * Authenticate request object. The request has to have an "AccessToken" header.
 * Returns a deciphered token with email, admin status, etc.
 */
var authenticateAccessToken = function (req) {
    var accessToken = req.headers.get("AccessToken");
    if (!accessToken) {
        console.log("No AccessToken");
        return {};
    }
    var result = {};
    try {
        var decoded = jsonwebtoken_1.default.verify(accessToken, process.env["SECRET"]);
        result["email"] = decoded.user["email"];
        result["isadmin"] = decoded.user["isadmin"];
    }
    catch (err) {
        console.log(err);
    }
    if (Object.keys(result).length === 0) {
        result["email"] = "";
        result["isadmin"] = false;
    }
    return result;
};
exports.authenticateAccessToken = authenticateAccessToken;
//
//
//
//
// ###################################################################################
/**
 * Authenticate request object. The request has to have a "RefreshToken" header.
 * Returns a deciphered token with email, admin status, etc.
 */
var authenticateRefreshToken = function (req) {
    var refreshToken = req.headers.get("RefreshToken");
    if (!refreshToken) {
        return {};
    }
    var result = {};
    try {
        var decoded = jsonwebtoken_1.default.verify(refreshToken, process.env["REFRESH_SECRET"]);
        result["email"] = decoded.user["email"];
        result["isadmin"] = decoded.user["isadmin"];
    }
    catch (err) {
        console.log(err);
    }
    if (Object.keys(result).length === 0) {
        result["email"] = "";
        result["isadmin"] = false;
    }
    return result;
};
exports.authenticateRefreshToken = authenticateRefreshToken;
//
//
//
//
// ###################################################################################
/**
 * Get an AccessToken for the provided data. Assigns an expiry to the token.
 */
var generateAccessToken = function (data) {
    return jsonwebtoken_1.default.sign(data, process.env["SECRET"], {
        expiresIn: process.env["TOKEN_EXPIRY"],
    });
};
exports.generateAccessToken = generateAccessToken;
//
//
//
//
// ###################################################################################
/**
 * Get a RefreshToken for the provided data. Assigns an expiry to the token.
 */
var generateRefreshToken = function (data) {
    return jsonwebtoken_1.default.sign(data, process.env["REFRESH_SECRET"]);
};
exports.generateRefreshToken = generateRefreshToken;
