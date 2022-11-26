const express = require("express");
const router = express.Router();

const userControl = require("../Controllers/user_auth");

const tokenverify = require("../Middleware/user_auth");
const userPasswordChange = require("../Controllers/user_change_password");
const update_profile = require("../Controllers/user_update_profile");
const get_profile = require("../Controllers/user_getProfile");
const logout_profile = require("../Controllers/user_logout");
const operation_details = require("../Controllers/user_login_details");
const forgot_pasword = require("../Controllers/user_forgot_password");

router.post(
  "/signup",
  userControl.upload_userimage.single("fimage"),
  userControl.userRegistration
);
router.post("/signup/verify",userControl.userRegistration)

router.post(
  "/singin",
  userControl.upload_userimage.none(),
  userControl.userlogin
);
router.get("/test", tokenverify, function (req, res) {
  res
    .status(200)
    .send({ success: true, message: "successfully token is verified" });
});
router.put("/changepassword", tokenverify, userPasswordChange.update_password);
router.put(
  "/update_profile/:id",
  tokenverify,
  userControl.upload_userimage.single("fimage"),
  update_profile.updateProfile
);
router.get("/get_profile", tokenverify, get_profile.getUserProfile);
router.put("/logout", tokenverify, logout_profile.authHeader);
router.get("/operation", tokenverify, operation_details.operationDetails);
router.post("/forgot_password", forgot_pasword.forgotpasword);
router.get("/reset_password", forgot_pasword.resetPassword);

module.exports = router;
