const express = require("express");
const session = require("express-session");
const myUser = require("../Models/user_login_details");
const User = require("../Models/user_auth");
const app = express();

// Session Setup
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);

// Get function in which send session as routes.
exports.operationDetails = async function (req, res, next) {
  if (req.session.views) {
    let data = await User.findById({ _id: req.user });
    req.session.views++;
    const user_operation = new myUser({
      name: data.name,
      email: data.email,
      sesion_id: req.session.views,
      login_time: new Date(),
    }).save();
    res.status(200).send(user_operation);
  } else {
    req.session.views = 1;
    res.end(" New session is started");
  }
};
