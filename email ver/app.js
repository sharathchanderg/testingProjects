const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const bodyparser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieparser = require("cookie-parser")

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieparser());

app.use(
  session({
    secret: "process.env.SAN_SESSION",
    resave: false,
    saveUninitialized: false,
    //cookie: {secure:true}
  })
);

const userRoute = require("./Routers/user_auth");
app.use("/api", userRoute);

mongoose
  .connect(
    //`mongodb+srv://${process.env.SAN_user}:${process.env.SAN_user}@cluster0.gfc0ofu.mongodb.net/?retryWrites=true&w=majority`
    `mongodb+srv://${process.env.SAN_user}:${process.env.SAN_password}@cluster0.gfc0ofu.mongodb.net/${process.env.SAN_DATABASE}`
  )
  .then(() => {
    console.log("DB is CONNECTED");
  })
  .catch((err) => {
    console.log("DB is NOT CONNECTED AND ERROR // " + err);
    console.log(process.env.SAN_user);
  });

app.get("/", (req, res) => {
  res.status(200).send("hello i working properly from server");
});

//for not found
app.use((req, res, next) => {
  const error = new error("not found");
  error.status = 404;
  next(error);
});

//other error
app.use((req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

//uncaughtException
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, APP SHUTTING!!");
  console.log(err.message, err.name);
  process.exit(1);
});
app.listen(process.env.SAN_PORT, () => {
  console.log(`http://127.0.0.1:${process.env.SAN_PORT}`);
});
