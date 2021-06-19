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
var status_1 = require("../../utils/status");
var filled_surveys_1 = require("../../database/filled_surveys");
var auth_1 = require("../../utils/auth");
//
//
//
//
// ########################################################################################
/**
 * PUBLIC or PRIVATE
 */
router.get("/:filledSurveyID(\\d+)/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                if (!(filled_surveys_1.isPublic_filled_survey(parseInt(req.params["filledSurveyID"])) ||
                    filled_surveys_1.isSurveyOwner_filled_survey(parseInt(req.params["filledSurveyID"]), user["email"]) ||
                    user["isadmin"])) return [3 /*break*/, 2];
                return [4 /*yield*/, filled_surveys_1.get_filled_survey_for_filled_survey_id(parseInt(req.params["filledSurveyID"]))];
            case 1:
                result = _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, res
                    .status(status_1.st["success"])
                    .json([{ result: result, message: status_1.getSuccessMessage(user) }])];
        }
    });
}); });
//
//
//
//
// ########################################################################################
/**
 * ADMIN, PUBLIC or PRIVATE
 */
router.get("/for-email/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, query, result, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                query = req.query;
                if (!query["email"]) {
                    return [2 /*return*/, res.status(status_1.st["bad"]).end()];
                }
                _a = req.params["type"];
                switch (_a) {
                    case "surveyOwner": return [3 /*break*/, 1];
                    case "filledSurveyOwner": return [3 /*break*/, 4];
                    case "all": return [3 /*break*/, 7];
                    case "public": return [3 /*break*/, 10];
                }
                return [3 /*break*/, 12];
            case 1:
                if (!(query["email"] === user["email"] || user["isadmin"])) return [3 /*break*/, 3];
                return [4 /*yield*/, filled_surveys_1.get_filled_survey_list_for_email__surveyOwner(query["email"])];
            case 2:
                result = _b.sent();
                _b.label = 3;
            case 3: return [3 /*break*/, 14];
            case 4:
                if (!(query["email"] === user["email"] || user["isadmin"])) return [3 /*break*/, 6];
                return [4 /*yield*/, filled_surveys_1.get_filled_survey_list_for_email__filledSurveyOwner(query["email"])];
            case 5:
                result = _b.sent();
                _b.label = 6;
            case 6: return [3 /*break*/, 14];
            case 7:
                if (!user["isadmin"]) return [3 /*break*/, 9];
                return [4 /*yield*/, filled_surveys_1.get_filled_survey_list_for_email__all(query["email"])];
            case 8:
                result = _b.sent();
                _b.label = 9;
            case 9: return [3 /*break*/, 14];
            case 10: return [4 /*yield*/, filled_surveys_1.get_filled_survey_list_for_email__public(query["email"])];
            case 11:
                result = _b.sent();
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, filled_surveys_1.get_filled_survey_list_for_email__public(query["email"])];
            case 13:
                result = _b.sent();
                _b.label = 14;
            case 14: return [2 /*return*/, res
                    .status(status_1.st["success"])
                    .json([{ result: result, message: status_1.getSuccessMessage(user) }])];
        }
    });
}); });
//
//
//
//
// ########################################################################################
/**
 * PUBLIC
 */
router.post("/:surveyID(\\d+)/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                return [4 /*yield*/, filled_surveys_1.create_filled_survey_for_survey_id(parseInt(req.params["surveyID"]), user["email"])];
            case 1:
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
// ########################################################################################
/**
 * ADMIN or OWNER
 */
router.delete("/:filledSurveyID(\\d+)/delete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = auth_1.authenticateAccessToken(req);
                if (!filled_surveys_1.isOwner_filled_survey(parseInt(req.params["filledSurveyID"]), user["email"]) ||
                    !user["isadmin"]) {
                    return [2 /*return*/, res.status(status_1.st["unauthorized"]).end()];
                }
                return [4 /*yield*/, filled_surveys_1.delete_filled_survey(parseInt(req.params["filledSurveyID"]))];
            case 1:
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
// ########################################################################################
exports.default = router;
