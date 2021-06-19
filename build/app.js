"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// env
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//
//
//
//
// ###################################################################################
// package imports
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
//
//
//
//
// ###################################################################################
// init app
var app = express_1.default();
//
//
//
//
// ###################################################################################
// CORS
var allowedOrigins = ["http://localhost", "http://127.0.0.1"];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = "The CORS policy for this site does not " +
                "allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
}));
//
//
//
//
// ###################################################################################
app.use(logger("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, "static")));
//
//
//
//
// ###################################################################################
// ROUTES
var admin_1 = __importDefault(require("./api/admin"));
var auth_1 = __importDefault(require("./api/auth"));
var field_types_1 = __importDefault(require("./api/crud/field_types"));
var filled_fields_1 = __importDefault(require("./api/crud/filled_fields"));
var filled_surveys_1 = __importDefault(require("./api/crud/filled_surveys"));
var survey_fields_1 = __importDefault(require("./api/crud/survey_fields"));
var surveys_1 = __importDefault(require("./api/crud/surveys"));
app.use("/admin", admin_1.default);
app.use("/auth", auth_1.default);
app.use("/field-types", field_types_1.default);
app.use("/filled-fields", filled_fields_1.default);
app.use("/filled-surveys", filled_surveys_1.default);
app.use("/survey-fields", survey_fields_1.default);
app.use("/surveys", surveys_1.default);
// empty home page
app.get("/", function (_req, res) {
    return res.status(200).json([
        {
            message: "This is the Survey Project API. This specific url is not used.",
        },
    ]);
});
// catch the annoying useless favicon.ico request (because this is an API, no HTML is served)
app.get("/favicon.ico", function (_req, res) { return res.status(204); });
//####################################################################
// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next(createError(404));
});
// // error handler
// app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
//   return res.status(500).json({ error: error.toString() });
// });
module.exports = app;
