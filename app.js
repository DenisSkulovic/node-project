// env
const dotenv = require("dotenv");
dotenv.config();

//
//
//
//
// ###################################################################################
// package imports
let createError = require("http-errors");
let express = require("express");
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
let app = express();

//
//
//
//
// ###################################################################################
// CORS
var allowedOrigins = ["http://localhost", "http://127.0.0.1"];
app.use(
  cors({
    origin: function (origin, callback) {
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
let adminRouter = require("./api/admin");
let authRouter = require("./api/auth");
let fieldTypesRouter = require("./api/crud/field_types");
let filledFieldsRouter = require("./api/crud/filled_fields");
let filledSurveysRouter = require("./api/crud/filled_surveys");
let surveyFieldsRouter = require("./api/crud/survey_fields");
let surveysRouter = require("./api/crud/surveys");

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/field-types", fieldTypesRouter);
app.use("/filled-fields", filledFieldsRouter);
app.use("/filled-surveys", filledSurveysRouter);
app.use("/survey-fields", surveyFieldsRouter);
app.use("/surveys", surveysRouter);

// empty home page
app.get("/", (req, res) =>
  res.status(200).json([
    {
      message: "This is the Survey Project API. This specific url is not used.",
    },
  ])
);

// catch the annoying useless favicon.ico request (because this is an API, no HTML is served)
app.get("/favicon.ico", (req, res) => res.status(204));

//####################################################################

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json([{ message: "Server error 500" }]);
});

module.exports = app;
