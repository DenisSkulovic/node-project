"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_survey_field =
  exports.update_survey_field =
  exports.create_survey_field =
  exports.get_survey_fields_list_for_survey_id__public =
  exports.get_survey_fields_list_for_survey_id__all =
  exports.get_survey_field_for_survey_field_id =
  exports.isOwner_survey_field =
  exports.isPublic_survey_field =
    void 0;
var db_1 = require("./db");
var page_size_1 = require("../utils/page_size");
var columns = [
  "id",
  "field_type_id",
  "survey_id",
  "title",
  "created_at",
  "modified_at",
];
//
//
//
//
// ###############################################################################
var isPublic_survey_field = function (survey_field_id) {
  return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            db_1.performQuery(
              "\n      SELECT public\n      FROM surveys s\n      LEFT JOIN survey_fields sf\n      ON sf.survey_id = s.id\n      WHERE sf.id = :survey_field_id\n      AND s.public = true;\n    ",
              new Map([["survey_field_id", survey_field_id]])
            ),
          ];
        case 1:
          result = _a.sent();
          if (result.rows.length > 0) {
            return [2 /*return*/, true];
          }
          return [2 /*return*/, false];
      }
    });
  });
};
exports.isPublic_survey_field = isPublic_survey_field;
//
//
//
//
// ###############################################################################
var isOwner_survey_field = function (survey_field_id, email) {
  return __awaiter(void 0, void 0, void 0, function () {
    var account_id, result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            db_1.performQuery("SELECT id FROM accounts WHERE email = :email", {
              email: email,
            }),
          ];
        case 1:
          account_id = _a.sent();
          if (account_id.rows.length === 0) {
            return [2 /*return*/, false];
          }
          account_id = account_id.rows[0]["id"];
          return [
            4 /*yield*/,
            db_1.performQuery(
              "\n    SELECT a.email\n    FROM survey_fields sf\n    LEFT JOIN surveys s\n    ON s.id = sf.survey_id\n    LEFT JOIN accounts a\n    ON a.id = s.account_id\n    WHERE sf.id = :survey_field_id\n    AND s.account_id = :account_id;\n  ",
              new Map([
                ["survey_field_id", survey_field_id],
                ["account_id", account_id],
              ])
            ),
          ];
        case 2:
          result = _a.sent();
          if (result.rows.length > 0) {
            return [2 /*return*/, true];
          }
          return [2 /*return*/, false];
      }
    });
  });
};
exports.isOwner_survey_field = isOwner_survey_field;
//
//
//
//
// ###############################################################################
var get_survey_field_for_survey_field_id = function (survey_field_id) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            db_1.performQuery(
              "\n    SELECT * \n    FROM survey_fields\n    WHERE id = :survey_field_id;\n  ",
              new Map([["survey_field_id", survey_field_id]])
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
};
exports.get_survey_field_for_survey_field_id =
  get_survey_field_for_survey_field_id;
//
//
//
//
// ###############################################################################
var get_survey_fields_list_for_survey_id__all = function (
  survey_id,
  order_by,
  page,
  per_page,
  order
) {
  if (order_by === void 0) {
    order_by = "id";
  }
  if (page === void 0) {
    page = 1;
  }
  if (per_page === void 0) {
    per_page = 10;
  }
  if (order === void 0) {
    order = "ASC";
  }
  return __awaiter(void 0, void 0, void 0, function () {
    var offset;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          per_page = page_size_1.handlePageSize(per_page, "large");
          offset = page * per_page - per_page;
          return [
            4 /*yield*/,
            db_1.performQuery(
              "SELECT sf.*\n    FROM survey_fields sf\n    LEFT JOIN survey s\n    ON s.id = sf.survey_id\n    WHERE s.id = :survey_id\n    ORDER BY sf." +
                (columns.includes(order_by) ? order_by : "id") +
                "\n    " +
                (order === "DESC" ? "DESC" : "ASC") +
                "    \n    OFFSET :offset\n    LIMIT :per_page;",
              {
                survey_id: survey_id,
                order_by: order,
                order: order,
                offset: offset,
                per_page: per_page,
              }
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
};
exports.get_survey_fields_list_for_survey_id__all =
  get_survey_fields_list_for_survey_id__all;
//
//
//
//
// ###############################################################################
var get_survey_fields_list_for_survey_id__public = function (
  survey_id,
  order_by,
  page,
  per_page,
  order
) {
  if (order_by === void 0) {
    order_by = "id";
  }
  if (page === void 0) {
    page = 1;
  }
  if (per_page === void 0) {
    per_page = 10;
  }
  if (order === void 0) {
    order = "ASC";
  }
  return __awaiter(void 0, void 0, void 0, function () {
    var offset;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          per_page = page_size_1.handlePageSize(per_page, "large");
          offset = page * per_page - per_page;
          return [
            4 /*yield*/,
            db_1.performQuery(
              "SELECT sf.*\n    FROM survey_fields sf\n    LEFT JOIN survey s\n    ON s.id = sf.survey_id\n    WHERE s.id = :survey_id\n    AND s.public = true\n    ORDER BY sf." +
                (columns.includes(order_by) ? order_by : "id") +
                "\n    " +
                (order === "DESC" ? "DESC" : "ASC") +
                "    \n    OFFSET :offset\n    LIMIT :per_page;",
              {
                survey_id: survey_id,
                order_by: order,
                order: order,
                offset: offset,
                per_page: per_page,
              }
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
};
exports.get_survey_fields_list_for_survey_id__public =
  get_survey_fields_list_for_survey_id__public;
//
//
//
//
// ###############################################################################
var create_survey_field = function (field_type_id, survey_id, title) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            db_1.performQuery(
              "INSERT INTO survey_fields (field_type_id, survey_id, title)\n    VALUES (:field_type_id, :survey_id, :title)\n    RETURNING *;",
              {
                field_type_id: field_type_id,
                survey_id: survey_id,
                title: title,
              }
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
};
exports.create_survey_field = create_survey_field;
//
//
//
//
// ###############################################################################
var update_survey_field = function (
  survey_field_id,
  survey_field_title,
  survey_field_type_id
) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            db_1.performQuery(
              "UPDATE survey_fields\n    SET title = :survey_field_title\n        survey_type_id = :survey_field_type_id\n    WHERE id = :survey_field_id\n    RETURNING *;",
              {
                survey_field_title: survey_field_title,
                survey_field_id: survey_field_id,
                survey_field_type_id: survey_field_type_id,
              }
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
};
exports.update_survey_field = update_survey_field;
//
//
//
//
// ###############################################################################
var delete_survey_field = function (survey_field_id) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            db_1.performQuery(
              "DELETE FROM survey_fields\n    WHERE id = :survey_field_id",
              new Map([["survey_field_id", survey_field_id]])
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
};
exports.delete_survey_field = delete_survey_field;
