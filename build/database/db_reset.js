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
exports.resetDatabase = void 0;
var db_1 = require("./db");
//
//
//
//
// ###############################################################################
/**
 * Drop every table, create tables and populate them with initial data
 * @returns {object} Query result after creating an admin account. Contains the admin email and admin status.
 */
// -------------------------------------------------------------------------------
var resetDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.performQuery("\n  DROP TABLE IF EXISTS accounts CASCADE;\n  DROP TABLE IF EXISTS field_types CASCADE;\n  DROP TABLE IF EXISTS surveys CASCADE;\n  DROP TABLE IF EXISTS survey_fields CASCADE;\n  DROP TABLE IF EXISTS filled_surveys CASCADE;\n  DROP TABLE IF EXISTS filled_fields CASCADE;\n\n\n\n  CREATE TABLE accounts(\n  id SERIAL,\n  email VARCHAR (255) NOT NULL,\n  password VARCHAR(255) NOT NULL,\n  isadmin BOOLEAN NOT NULL,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY(id)\n  );\n  ALTER TABLE accounts ALTER COLUMN isadmin SET DEFAULT false;\n\n\n\n  CREATE TABLE field_types(\n  id SERIAL,\n  name VARCHAR (255) NOT NULL UNIQUE,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id)\n  );\n\n\n\n  CREATE TABLE surveys(\n  id SERIAL,\n  title VARCHAR (255) NOT NULL,\n  public BOOLEAN NOT NULL,\n  account_id BIGINT NOT NULL,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY(id),\n  CONSTRAINT fk_account\n    FOREIGN KEY(account_id)\n    REFERENCES accounts(id)\n    ON DELETE RESTRICT\n  );\n  ALTER TABLE surveys ALTER COLUMN public SET DEFAULT false;\n\n\n\n  CREATE TABLE survey_fields(\n  id SERIAL,\n  field_type_id BIGINT NOT NULL,\n  survey_id BIGINT NOT NULL,\n  title VARCHAR (255) NOT NULL,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY(id),\n  CONSTRAINT fk_field_type\n    FOREIGN KEY(field_type_id)\n    REFERENCES field_types(id)\n    ON DELETE RESTRICT,\n  CONSTRAINT fk_survey\n    FOREIGN KEY(survey_id)\n    REFERENCES surveys(id)\n    ON DELETE CASCADE\n  );\n\n\n\n  CREATE TABLE filled_surveys (\n  id SERIAL,\n  survey_id BIGINT NOT NULL,\n  account_id BIGINT,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY(id),\n  CONSTRAINT fk_survey\n    FOREIGN KEY(survey_id)\n    REFERENCES surveys(id)\n    ON DELETE CASCADE,\n  CONSTRAINT fk_account\n    FOREIGN KEY(account_id)\n    REFERENCES accounts(id)\n    ON DELETE CASCADE\n  );\n\n\n\n  CREATE TABLE filled_fields (\n  id SERIAL,\n  survey_field_id BIGINT NOT NULL,\n  filled_survey_id BIGINT NOT NULL,\n  answer TEXT NOT NULL,\n  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY(id),\n  CONSTRAINT fk_survey_field\n    FOREIGN KEY(survey_field_id)\n    REFERENCES survey_fields(id)\n    ON DELETE RESTRICT,\n  CONSTRAINT fk_filled_survey\n    FOREIGN KEY(filled_survey_id)\n    REFERENCES filled_surveys(id)\n    ON DELETE CASCADE\n  );\n\n\n  \n  /* function to automatically update timestamp */\n  CREATE OR REPLACE FUNCTION trigger_set_timestamp()\n  RETURNS TRIGGER AS $$\n  BEGIN\n  NEW.modified_at = NOW();\n  RETURN NEW;\n  END;\n  $$ LANGUAGE plpgsql;\n\n  CREATE TRIGGER set_timestamp\n  BEFORE UPDATE ON accounts\n  FOR EACH ROW\n  EXECUTE PROCEDURE trigger_set_timestamp();\n\n  CREATE TRIGGER set_timestamp\n  BEFORE UPDATE ON field_types\n  FOR EACH ROW\n  EXECUTE PROCEDURE trigger_set_timestamp();\n\n  CREATE TRIGGER set_timestamp\n  BEFORE UPDATE ON filled_fields\n  FOR EACH ROW\n  EXECUTE PROCEDURE trigger_set_timestamp();\n\n  CREATE TRIGGER set_timestamp\n  BEFORE UPDATE ON filled_surveys\n  FOR EACH ROW\n  EXECUTE PROCEDURE trigger_set_timestamp();\n\n  CREATE TRIGGER set_timestamp\n  BEFORE UPDATE ON survey_fields\n  FOR EACH ROW\n  EXECUTE PROCEDURE trigger_set_timestamp();\n\n  CREATE TRIGGER set_timestamp\n  BEFORE UPDATE ON surveys\n  FOR EACH ROW\n  EXECUTE PROCEDURE trigger_set_timestamp();\n  ", {})];
            case 1:
                _a.sent();
                return [4 /*yield*/, db_1.performQuery("\n  INSERT INTO field_types (name)\n    VALUES (\"textarea\"),\n          (\"radio\"),\n          (\"input_text\"),\n          (\"input_number\"),\n          (\"input_checkbox\");\n  ", {})];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_1.performQuery("\n    INSERT INTO accounts (email, password, isadmin)\n    VALUES (:email, :password, :isadmin)\n    RETURNIING email, isadmin;\n    ", {
                        email: "admin@email.com",
                        password: "123456789",
                        isadmin: true
                    })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.resetDatabase = resetDatabase;
