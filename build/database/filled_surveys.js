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
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_filled_survey = exports.create_filled_survey_for_survey_id = exports.get_filled_survey_list_for_email__public = exports.get_filled_survey_list_for_email__surveyOwner = exports.get_filled_survey_list_for_email__filledSurveyOwner = exports.get_filled_survey_list_for_email__all = exports.get_filled_survey_for_filled_survey_id = exports.isSurveyOwner_filled_survey = exports.isOwner_filled_survey = exports.isPublic_filled_survey = void 0;
var db_1 = require("./db");
var page_size_1 = require("../utils/page_size");
var columns = ["id", "survey_id", "account_id", "created_at", "modified_at"];
//
//
//
//
// ###############################################################################
var isPublic_filled_survey = function (filled_survey_id) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.performQuery("\n    SELECT s.public\n    FROM surveys s\n    LEFT JOIN filled_surveys fs\n    ON fs.survey_id = s.id\n    WHERE fs.id = :filled_survey_id\n    AND s.public = true;\n  ", new Map([["filled_survey_id", filled_survey_id]]))];
            case 1:
                result = _a.sent();
                if (result.rows.length > 0) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
        }
    });
}); };
exports.isPublic_filled_survey = isPublic_filled_survey;
//
//
//
//
// ###############################################################################
var isOwner_filled_survey = function (filled_survey_id, email) { return __awaiter(void 0, void 0, void 0, function () {
    var account_id, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.performQuery("\n  SELECT id FROM accounts WHERE email = :email", new Map([["email", email]]))];
            case 1:
                account_id = _a.sent();
                if (account_id.rows.length === 0) {
                    return [2 /*return*/, false];
                }
                account_id = account_id.rows[0]["id"];
                return [4 /*yield*/, db_1.performQuery("\n    SELECT a.email\n    FROM filled_surveys fs\n    LEFT JOIN accounts a\n    ON a.id = fs.account_id\n    WHERE fs.id = :filled_survey_id\n    AND fs.account_id = :account_id;\n  ", new Map([
                        ["filled_survey_id", filled_survey_id],
                        ["account_id", account_id]
                    ]))];
            case 2:
                result = _a.sent();
                if (result.rows.length > 0) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
        }
    });
}); };
exports.isOwner_filled_survey = isOwner_filled_survey;
//
//
//
//
// ###############################################################################
var isSurveyOwner_filled_survey = function (filled_survey_id, email) { return __awaiter(void 0, void 0, void 0, function () {
    var account_id, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.performQuery("\n  SELECT id FROM accounts WHERE email = :email;", new Map([["email", email]]))];
            case 1:
                account_id = _a.sent();
                if (account_id.rows.length === 0) {
                    return [2 /*return*/, false];
                }
                account_id = account_id.rows[0]["id"];
                return [4 /*yield*/, db_1.performQuery("\n    SELECT a.email\n    FROM filled_surveys fs\n    LEFT JOIN surveys s\n    ON s.id = fs.survey_id\n    LEFT JOIN accounts a\n    ON a.id = s.account_id\n    WHERE fs.id = :filled_survey_id\n    AND s.account_id = :account_id;\n  ", new Map([
                        ["filled_survey_id", filled_survey_id],
                        ["account_id", account_id]
                    ]))];
            case 2:
                result = _a.sent();
                if (result.rows.length > 0) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
        }
    });
}); };
exports.isSurveyOwner_filled_survey = isSurveyOwner_filled_survey;
//
//
//
//
// ###############################################################################
var get_filled_survey_for_filled_survey_id = function (filled_survey_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.performQuery("SELECT * \n    FROM filled_surveys\n    WHERE id = :filled_survey_id;", new Map([["filled_survey_id", filled_survey_id]]))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.get_filled_survey_for_filled_survey_id = get_filled_survey_for_filled_survey_id;
//
//
//
//
// ###############################################################################
var get_filled_survey_list_for_email__all = function (email, order_by, page, per_page, order) {
    if (order_by === void 0) { order_by = "id"; }
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    if (order === void 0) { order = "ASC"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var offset, account_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    per_page = page_size_1.handlePageSize(per_page, "large");
                    offset = page * per_page - per_page;
                    return [4 /*yield*/, db_1.performQuery("SELECT id FROM accounts WHERE email = :email;", new Map([["email", email]]))];
                case 1:
                    account_id = _a.sent();
                    if (account_id.rows.length === 0) {
                        return [2 /*return*/, account_id];
                    }
                    account_id = account_id.rows[0]["id"];
                    return [4 /*yield*/, db_1.performQuery("\n    SELECT fs.* \n    FROM filled_surveys fs\n    LEFT JOIN accounts a\n    ON a.id = fs.account_id\n    WHERE a.id = :account_id\n    ORDER BY " + (columns.includes(order_by) ? order_by : "id") + "    \n    " + (order === "DESC" ? "DESC" : "ASC") + "    \n    OFFSET :offset\n    LIMIT :per_page;\n  ", new Map([
                            ["account_id", account_id],
                            ["order_by", order_by],
                            ["order", order],
                            ["offset", offset],
                            ["per_page", per_page]
                        ]))];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.get_filled_survey_list_for_email__all = get_filled_survey_list_for_email__all;
//
//
//
//
// ###############################################################################
var get_filled_survey_list_for_email__filledSurveyOwner = function (email, order_by, page, per_page, order) {
    if (order_by === void 0) { order_by = "id"; }
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    if (order === void 0) { order = "ASC"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var offset, account_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    per_page = page_size_1.handlePageSize(per_page, "large");
                    offset = page * per_page - per_page;
                    return [4 /*yield*/, db_1.performQuery("SELECT id FROM accounts WHERE email = :email;", new Map([["email", email]]))];
                case 1:
                    account_id = _a.sent();
                    if (account_id.rows.length === 0) {
                        return [2 /*return*/, account_id];
                    }
                    account_id = account_id.rows[0]["id"];
                    return [4 /*yield*/, db_1.performQuery("\n    SELECT fs.* \n    FROM filled_surveys fs\n    WHERE fs.account_id = :account_id\n    ORDER BY " + (columns.includes(order_by) ? order_by : "id") + "\n    " + (order === "DESC" ? "DESC" : "ASC") + "    \n    OFFSET :offset\n    LIMIT :per_page;\n  ", new Map([
                            ["account_id", account_id],
                            ["order_by", order_by],
                            ["order", order],
                            ["offset", offset],
                            ["per_page", per_page]
                        ]))];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.get_filled_survey_list_for_email__filledSurveyOwner = get_filled_survey_list_for_email__filledSurveyOwner;
//
//
//
//
// ###############################################################################
var get_filled_survey_list_for_email__surveyOwner = function (email, order_by, page, per_page, order) {
    if (order_by === void 0) { order_by = "id"; }
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    if (order === void 0) { order = "ASC"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var offset, account_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    per_page = page_size_1.handlePageSize(per_page, "large");
                    offset = page * per_page - per_page;
                    return [4 /*yield*/, db_1.performQuery("SELECT id FROM accounts WHERE email = :email;", new Map([["email", email]]))];
                case 1:
                    account_id = _a.sent();
                    if (account_id.rows.length === 0) {
                        return [2 /*return*/, account_id];
                    }
                    account_id = account_id.rows[0]["id"];
                    return [4 /*yield*/, db_1.performQuery("\n    SELECT fs.* \n    FROM filled_surveys fs\n    LEFT JOIN survey s\n    ON s.id = fs.survey_id\n    WHERE s.account_id = :account_id\n    ORDER BY " + (columns.includes(order_by) ? order_by : "id") + "\n    " + (order === "DESC" ? "DESC" : "ASC") + "    \n    OFFSET :offset\n    LIMIT :per_page;\n  ", new Map([
                            ["account_id", account_id],
                            ["order_by", order_by],
                            ["order", order],
                            ["offset", offset],
                            ["per_page", per_page]
                        ]))];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.get_filled_survey_list_for_email__surveyOwner = get_filled_survey_list_for_email__surveyOwner;
//
//
//
//
// ###############################################################################
var get_filled_survey_list_for_email__public = function (email, order_by, page, per_page, order) {
    if (order_by === void 0) { order_by = "id"; }
    if (page === void 0) { page = 1; }
    if (per_page === void 0) { per_page = 10; }
    if (order === void 0) { order = "ASC"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var offset, account_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    per_page = page_size_1.handlePageSize(per_page, "large");
                    offset = page * per_page - per_page;
                    return [4 /*yield*/, db_1.performQuery("SELECT id FROM accounts WHERE email = :email;", new Map([["email", email]]))];
                case 1:
                    account_id = _a.sent();
                    if (account_id.rows.length === 0) {
                        return [2 /*return*/, account_id];
                    }
                    account_id = account_id.rows[0]["id"];
                    return [4 /*yield*/, db_1.performQuery("\n    SELECT fs.* \n    FROM filled_surveys fs\n    LEFT JOIN survey s\n    ON s.id = fs.survey_id\n    WHERE s.public = true\n    AND s.fs.account_id = :account_id\n    ORDER BY " + (columns.includes(order_by) ? order_by : "id") + "    " + (order === "DESC" ? "DESC" : "ASC") + "    \n    OFFSET :offset\n    LIMIT :per_page;\n  ", new Map([
                            ["account_id", account_id],
                            ["order_by", order_by],
                            ["order", order],
                            ["offset", offset],
                            ["per_page", per_page]
                        ]))];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.get_filled_survey_list_for_email__public = get_filled_survey_list_for_email__public;
//
//
//
//
// ###############################################################################
var create_filled_survey_for_survey_id = function (survey_id, email) { return __awaiter(void 0, void 0, void 0, function () {
    var account_id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!email) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.performQuery("SELECT id FROM accounts WHERE email = :email;", new Map([["email", email]]))];
            case 1:
                account_id = _a.sent();
                if (account_id.rows.length === 0) {
                    return [2 /*return*/, account_id];
                }
                account_id = account_id.rows[0]["id"];
                return [4 /*yield*/, db_1.performQuery("INSERT INTO filled_surveys (survey_id, account_id)\n    VALUES (:survey_id, :account_id)\n    RETURNING *;", new Map([
                        ["survey_id", survey_id],
                        ["account_id", account_id]
                    ]))];
            case 2: return [2 /*return*/, _a.sent()];
            case 3: return [4 /*yield*/, db_1.performQuery("INSERT INTO filled_surveys (survey_id)\n        VALUES (:survey_id)\n        RETURNING *;", new Map([["survey_id", survey_id]]))];
            case 4: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.create_filled_survey_for_survey_id = create_filled_survey_for_survey_id;
//
//
//
//
// ###############################################################################
var delete_filled_survey = function (filled_survey_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.performQuery("DELETE FROM filled_surveys\n    WHERE id = :filled_survey_id", new Map([["filled_survey_id", filled_survey_id]]))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.delete_filled_survey = delete_filled_survey;
