const dotenv = require("dotenv");
dotenv.config();

let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const session = require("express-session");
const secret = process.env.SECRET;

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));
app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      httpOnly: false,
      maxAge: 1 * 60 * 60 * 1000,
    },
  })
);

// catch the annoying useless favicon.ico request (because this is an API, no HTML is served)
app.get("/favicon.ico", (req, res) => res.status(204));

//####################################################################
// ROUTES
let adminRouter = require("./api/admin");
let authRouter = require("./api/auth");
let fieldTypesRouter = require("./api/generic_crud/field_types");
let filledFieldsRouter = require("./api/generic_crud/filled_fields");
let filledSurveysRouter = require("./api/generic_crud/filled_surveys");
let surveyFieldsRouter = require("./api/generic_crud/survey_fields");
let surveysRouter = require("./api/generic_crud/surveys");

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/field-types", fieldTypesRouter);
app.use("/filled-fields", filledFieldsRouter);
app.use("/filled-surveys", filledSurveysRouter);
app.use("/survey-fields", surveyFieldsRouter);
app.use("/surveys", surveysRouter);

app.get("/", (req, res) =>
  res.status(200).json([
    {
      message: "This is the Survey Project API. This specific url is not used.",
    },
  ])
);

//####################################################################

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json([{ message: "Server error 500" }]);
});

module.exports = app;
