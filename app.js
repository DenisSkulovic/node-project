let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));

// catch the annoying useless favicon.ico request (because this is an API, no HTML is served)
app.get("/favicon.ico", (req, res) => res.status(204));

//####################################################################
// ROUTES
let adminRouter = require("./api/admin");
let accountRouter = require("./api/account");

app.use("/admin", adminRouter);
app.use("/account", accountRouter);
//####################################################################

//####################################################################
// auth
let authenticateJwtRequestToken = require("./auth/auth");

app.use(authenticateJwtRequestToken());
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
