const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();
const User = require("../Models/user_auth");

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
    
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
exports.userSignUp = async(req,res)=>{
  try{ 
    const newuser = new User({
      name:req.body.name,
      mobile:req.body.mobile,
      email:req.body.email,
      password:req.body.password,
      emailToken:crypto.randomBytes(64).toString("hex"),
      isVerfied:false,
      status:1,
      profile_image:req.body.profile_image
    });
    const hashpasword = await bcrypt.hash(newuser.password,salt);
    newuser.password = hashpasword
    const newUser = await newuser.save();
    const mailOption = {
      from: process.env.SAN_EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Hello ${name}!!</h1>
            <p>Please copy the <a href="http://${req.headers.host}/api/verify-mail?token=${user.emailToken}">link</a> to verify your email</p>`,
    };
    transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("mail has sent to your registered email ", info.response);
      }
    });
  }
  catch{
    return res.status(400).json({ meassage: "something went wrong", error: err });
  }
}

const createToken = (id)=>{
    return jwt.sign({id},"process.env.SAN_SECRET")
}


//for profile photo location
const Storage = multer.diskStorage({
  destination: "uploads_photos",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
exports.upload_userimage = multer({
  storage: Storage,
});



//user registration
exports.userRegistration = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ message: "user already exist" });
    }
    
    const adduser = new User({
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      created_date: new Date(),
      status: req.body.status,
      profile_image: req.file.path,
    });
    adduser.save(function (err, data) {
      if (err) {
        console.log(err);
        if (err.keyPattern["email"]) {
          return res.status(400).json({
            message: "User already exist",
          });
        }
        if (err.keyPattern["mobile"]) {
          console.log(err.keyPattern["mobile"]);
          return res.status(400).json({
            message: "Entered mobile number is already exist",
          });
        }
        return res
          .status(400)
          .json({ meassage: "something went wrong", error: err });
      } else {
        return res.status(201).json({ message: "User Successfully Created" });
      }
    });
  });
};
const token_generate = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, "process.env.SAN_SECRET");
    return token;
  } catch {
    res.status(400).send("error: somethingt went wrong");
  }
};


//user login
exports.userlogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const usermail = await User.findOne({ email: email });
    if (usermail) {
      const isMatch = await bcrypt.compare(password, usermail.password);
      if (isMatch) {
        let token = await token_generate(usermail._id);
        let userdata = {
          id: usermail._id,
          name: usermail.name,
          email: usermail.email,
          mobile: usermail.mobile,
          password: usermail.password,
        };
        const response = {
          success: true,
          message: "user details",
          data: userdata,
          token: token,
        };
        res.status(200).send(response);
      } else {
        res
          .status(404)
          .send({ message: "you entered wrong email or password" });
      }
    }
  } catch {
    return res.status(404).send({ message: "user not found" });
  }
};


// exports.signUp = async(req,res)=>{
//   const user = await User.findOne({
//     number:req.body.number
//   });
//   if(user){
//     return res.status(400).send("user already registered"); 
//   }}
//   const OTP = otpGenerator.generate(6,{
//     digits:true, lowerCaseAlphabets:false, upperCaseAlphabets:false
//   })
// const number = req.body.number
// const Otp = new Otp({number:number, otp:OTP})
// otp.otp = await bcrypt.hash(otp.otp, salt);
// const result = await otp.save()

// module.exports.verifyOtp = async(req,res)=>{
//   const otpHolder = await otp.find({
//     number:req.body.number
//   });
//   if(otpHolder.length === 0){
//     return res.status(404).send("you used expired otp");
//   }  
//   const rightOtpFind = otpHolder[otpHolder.length-1];
//   const validateUser = await bcrypt.compare(req.body.otp, rightOtpField);
//   if(rightOtpFind.number === req.body.number && validateUser){
//     const user = new Myuser(_.pick(req.body.["number"]))
//     const token = user.generateJWT();
//     const result = await user.save();
//     const otpDelete = await otp.deleteMany({
//       number : rightOtpFind.number
//     });
//     return req.status(200).send({
//       message:"User registration successfully",
//       token:token,
//       data:result
//     })
//   }else{
//     return res.status(400).send("you entered wrong otp")
//   }
// }
