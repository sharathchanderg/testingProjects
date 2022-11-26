const jwt = require("jsonwebtoken");
require("dotenv").config();
expired = null;
const verifyToken = async (req, res, next) => {
  const token = await req.headers["authorization"];
  if (token) {
    bearer_token = await token.split(" ")[1];
  }
  if (bearer_token) {
    jwt.verify(bearer_token, "process.env.SAN_SECRET", function (err, decode) {
      if (err) {
        try {
          expired = err;
          let lastDate = expired.expiredAt.toLocaleDateString();
          let lastTime = expired.expiredAt.toLocaleTimeString();
          let loggedOut = `logged out ${lastDate} at ${lastTime}`;
          res
            .status(400)
            .json({ message: "token expired", Error: expired, loggedOut });
        } catch (err) {
          res
            .status(400)
            .json({ message: "token expired", Error: expired, loggedOut });
        }
      }
      if (decode) {
        req.user = decode._id;
        next();
      }
    });
  }
};
module.exports = verifyToken;
