const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
require("dotenv").config();
const User = require("../Models/user_auth");
const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hashSync(password, 10);
    return hashPassword;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const sentEmailToReset = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      //service:'gmail',
      auth: {
        user: "sharathchanderg3@gmail.com",
        pass: "drodhxsooferaydf",
      },
    });
    const mailOption = {
      from: process.env.SAN_EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Hello ${name}!!</h1>
            <p>Please copy the <a href="http://localhost:4000/api/reset_password?token=${token}">link</a> to reset your password</p>`,
    };
    transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("mail has sent to your registered email ", info.response);
      }
    });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

exports.forgotpasword = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      //console.log(data)
      sentEmailToReset(data.name, userData.email, randomString);
      res.status(200).send({
        success: true,
        meassage: "please check your email to reset your password",
      });
    }
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    console.log(token);
    const tokenData = await User.findOne({ token: token });
    //console.log(tokenData)
    if (tokenData) {
      const password = req.body.password;
      const hashingPassword = await securePassword(password);
      const userData = await User.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: hashingPassword }, token: " " },
        { new: true }
      );
      console.log(userData);
      res
        .status(200)
        .send({
          success: true,
          message: "your password is rested successfully",
          data: userData,
        });
    }
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
