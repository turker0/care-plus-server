const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

//const profileRoute = require("./routers/profile");
//const foodRoute = require("./routers/food");
//const dietRoute = require("./routers/diet");

const profiles = require("./api/profiles");
const diets = require("./api/diets");

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected."))
  .catch((err) => console.log(err));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/profiles", profiles);
app.use("/api/diets", diets);

/*
app.use("/profile", profileRoute);
app.use("/food", foodRoute);
app.use("/diet", dietRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
*/
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
