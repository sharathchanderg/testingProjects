const User = require("../Models/user_auth");
// const multer = require("multer");

//for profile photo location
// const Storage = multer.diskStorage({
//   destination: "uploads_photos",
//   filename: (req, file, cb) => {
//     cb(null, Date.now()+"-"+file.originalname);
//   },
// });
// exports.upload_userimage = multer({ 
//   storage: Storage,
// });
exports.updateProfile = async function (req, res) {
  let data = await User.findOneAndUpdate(
    { _id:req.params.id },
    {
      name: req.body.name, 
      mobile: req.body.mobile,
      email: req.body.email,
      profile_image: req.file.path, 
    }
  );
  if (data) {
    res.status(200).json({ message: "profile updated successfully" });
  } else {
    res.status(400).json({ message: "unable update profile" });
  }
};