import express, {
  Express, Request, Response,
  // NextFunction
} from "express";

// env
import dotenv from "dotenv";
dotenv.config();

//
//
//
//
// ###################################################################################
// package imports
let createError = require("http-errors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
var cors = require("cors");

//
//
//
//
// ###################################################################################
// init app
let app: Express = express();

//
//
//
//
// ###################################################################################
// CORS
var allowedOrigins = ["http://localhost", "http://127.0.0.1"];
app.use(
  cors({
    origin: function (origin: string, callback: Function) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

//
//
//
//
// ###################################################################################
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));

//
//
//
//
// ###################################################################################
// ROUTES
import adminRouter from "./api/admin"
import authRouter from "./api/auth"
import fieldTypesRouter from "./api/crud/field_types"
import filledFieldsRouter from './api/crud/filled_fields'
import filledSurveysRouter from "./api/crud/filled_surveys"
import surveyFieldsRouter from "./api/crud/survey_fields"
import surveysRouter from "./api/crud/surveys"

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/field-types", fieldTypesRouter);
app.use("/filled-fields", filledFieldsRouter);
app.use("/filled-surveys", filledSurveysRouter);
app.use("/survey-fields", surveyFieldsRouter);
app.use("/surveys", surveysRouter);

// empty home page
app.get("/", (_req: Request, res: Response) =>
  res.status(200).json([
    {
      message: "This is the Survey Project API. This specific url is not used.",
    },
  ])
);

// catch the annoying useless favicon.ico request (because this is an API, no HTML is served)
app.get("/favicon.ico", (_req: Request, res: Response) => res.status(204));

//####################################################################

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next) {
  next(createError(404));
});

// // error handler
// app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
//   return res.status(500).json({ error: error.toString() });
// });

module.exports = app;
