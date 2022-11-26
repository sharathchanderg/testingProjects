const User = require("../Models/user_auth");

exports.getUserProfile = async (req, res) => {
  const userProfile = await User.findById({ _id: req.body._id });
  if (userProfile) {
    res.status(200).json({ message: "Success", profile: userProfile });
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};
