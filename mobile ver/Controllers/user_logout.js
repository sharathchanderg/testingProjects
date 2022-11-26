const User = require("../Models/user_auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authHeader = (req, res) => {
  header = req.headers["authorization"];
  jwt.sign(
    header,
    "process.env.SAN_SECRET",
    { expiresIn: 1 },
    (logout, err) => {
      if (logout) {
        res.send({ message: "you are successfully logged out " });
      } else {
        res.send({ message: "error" });
      }
    }
  );
};
