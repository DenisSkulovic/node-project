"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var auth_1 = require("../utils/auth");
var status_1 = require("../utils/status");
var auth_2 = require("../database/auth");
// https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js
// has to be a let to apply a filter function; of course it's possible to do it differently and have a const
var refreshTokens = [];
//
//
//
//
// ###############################################################
router.post("/refreshtoken", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result, isadmin, accessToken, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.refreshToken) {
                    return [2 /*return*/, res.status(status_1.st["bad"]).end()];
                }
                if (!refreshTokens.includes(req.body.refreshToken)) {
                    return [2 /*return*/, res.status(status_1.st["notfound"]).end()];
                }
                user = auth_1.authenticateRefreshToken(req.body.refreshToken);
                if (!user["email"]) {
                    return [2 /*return*/, res.status(status_1.st["forbidden"]).end()];
                }
                return [4 /*yield*/, auth_2.getUserPasswordAndAdminStatus(user["email"])];
            case 1:
                result = _a.sent();
                isadmin = result.rows[0]["isadmin"];
                accessToken = auth_1.generateAccessToken({
                    email: user["email"],
                    isadmin: isadmin,
                });
                message = status_1.getSuccessMessage(user);
                message["isAuthenticated"] = true;
                message["isAdmin"] = isadmin ? true : false;
                return [2 /*return*/, res.status(status_1.st["success"]).json({
                        accessToken: accessToken,
                        message: message,
                    })];
        }
    });
}); });
//
//
//
//
// ###############################################################
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, message, result, isadmin, accessToken, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                message = status_1.getSuccessMessage(user);
                if (!req.body.email || !req.body.password) {
                    return [2 /*return*/, res.status(status_1.st["bad"]).end()];
                }
                return [4 /*yield*/, auth_2.getUserPasswordAndAdminStatus(req.body.email)];
            case 1:
                result = _a.sent();
                if (req.body.password != result.rows[0]["password"]) {
                    return [2 /*return*/, res.status(status_1.st["error"]).end()];
                }
                isadmin = result.rows[0]["isadmin"];
                accessToken = auth_1.generateAccessToken({
                    email: req.body.email,
                    isadmin: isadmin,
                });
                refreshToken = auth_1.generateRefreshToken({
                    email: req.body.email,
                    isadmin: isadmin,
                });
                refreshTokens.push(refreshToken);
                console.log("isadmin", isadmin);
                message["isAuthenticated"] = true;
                message["isAdmin"] = isadmin ? true : false;
                return [2 /*return*/, res.status(status_1.st["success"]).json([
                        {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            message: message,
                        },
                    ])];
        }
    });
}); });
//
//
//
//
// ###############################################################
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, message, result, accessToken, refreshToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                message = status_1.getSuccessMessage(user);
                if (!req.body.email || !req.body.password) {
                    return [2 /*return*/, res.status(status_1.st["bad"]).end()];
                }
                return [4 /*yield*/, auth_2.register(req.body.email, req.body.password, user["isadmin"] && req.body.isadmin ? req.body.isadmin : false)];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(status_1.st["error"]).end()];
                }
                accessToken = auth_1.generateAccessToken({
                    email: req.body.email,
                    isadmin: user["isadmin"] && req.body.isadmin ? req.body.isadmin : false,
                });
                refreshToken = auth_1.generateRefreshToken({
                    email: req.body.email,
                    isadmin: user["isadmin"] && req.body.isadmin ? req.body.isadmin : false,
                });
                refreshTokens.push(refreshToken);
                message["isAuthenticated"] = true;
                message["isAdmin"] = user["isadmin"] ? true : false;
                return [2 /*return*/, res.status(status_1.st["created"]).json([
                        {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            message: message,
                        },
                    ])];
        }
    });
}); });
//
//
//
//
// ###############################################################
router.post("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, message;
    return __generator(this, function (_a) {
        user = auth_1.authenticateAccessToken(req);
        message = status_1.getSuccessMessage(user);
        // better to move this refresh tokens list into the database (later)
        refreshTokens = refreshTokens.filter(function (t) { return t !== req.body.refreshToken; });
        message["isAuthenticated"] = false;
        message["isAdmin"] = false;
        return [2 /*return*/, res.status(status_1.st["success"]).json([{ message: message }])];
    });
}); });
//
//
//
//
// ###############################################################
router.post("/change-password", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userData, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                if (!user["email"]) {
                    return [2 /*return*/, res.status(status_1.st["unauthorized"].end())];
                }
                if (!req.body.email || !req.body.password) {
                    return [2 /*return*/, res.status(status_1.st["bad"]).end()];
                }
                return [4 /*yield*/, auth_2.getUserPasswordAndAdminStatus(req.body.email)];
            case 1:
                userData = _a.sent();
                if (!user["isadmin"] &&
                    ("" + req.body.password !== "" + userData.rows[0]["password"] ||
                        "" + user["email"] !== "" + req.body.email)) {
                    return [2 /*return*/, res.status(status_1.st["unauthorized"]).end()];
                }
                return [4 /*yield*/, auth_2.change_password(user["isadmin"] ? req.body.email : user["email"], req.body.newPassword)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res
                        .status(status_1.st["created"])
                        .json([{ result: result, message: status_1.getSuccessMessage(user) }])];
        }
    });
}); });
//
//
//
//
// ###############################################################
exports.default = router;
