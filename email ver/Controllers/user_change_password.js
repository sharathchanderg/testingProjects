const bcrypt = require("bcryptjs");
const User = require("../Models/user_auth");

const securePassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hashSync(password, 10);
    return hashPassword;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.update_password = async (req, res) => {
  try {
    const newpassword = req.body.newpassword;
    const verifyPassword = req.body.verifyPassword;
    if (newpassword == verifyPassword) {
      const data = User.findOne({ _id: req.user });
      console.log(data);
      if (data) {
        const newPassword = await securePassword(verifyPassword);
        await User.findOneAndUpdate(
          { _id: req.user },
          { $set: { password: newPassword } }
        );
        res.status(200).send({
          success: true,
          message: "your password updated successfully",
        });
      }
    } else {
      res.status(404).send("you entered password is not matched");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//change password
// exports.changeUserPassword = async (req, res) => {
//   try {
//     const info = {
//       old_pasword: req.body.hashed_password,
//       new_password: req.body.newPassword,
//       confirm_password: req.body.verifyPassword
//     };
//     if (old_pasword==new_password)
//       {
//         return res.status(422).send(info.error)
//       }
//     let current_user = req.user;
//     if(bcrypt.compareSync(req.body.old_pasword, current_user.hashed_password)){
//       let hashPassword = bcrypt.hashSync(req.body.new_password, 10);
//       await User.updateOne(
//         { email: current_user.email },
//         {
//           hashed_password: hashPassword,
//         }
//       );
//       let userData = await User.findOne({ email: current_user.email });

//       let token = jwt.sign({data: userData},"process.env.SAN_SECRET",{ expiresIn: "24h" });
//       return res.status(200).send({
//         message: "password successfully updated",
//         data: userData,
//         token: token,
//       });} else {
//       return res.status(400).send({
//         message: err.message,
//         data: err,
//       });
//     }
//   } catch (err) {
//     return res.status(400).send({
//       message: err.message,
//       data: err,
//     });
//   }
// };
// exports.changeUserPassword = async (req, res) => {
//   try {
//     const info = new validator(req.body, {
//       old_pasword: "required",
//       new_password: "required",
//       confirm_password: "required || same:new_password",
//     });
//     const matched = await info.check();
//     if (!matched) {return res.status(422).send(info.error);}
//     let current_user = req.user;
//     if(bcrypt.compareSync(req.body.old_pasword, current_user.hashed_password)){
//       let hashPassword = bcrypt.hashSync(req.body.new_password, 10);
//       await User.updateOne(
//         { email: current_user.email },
//         {
//           hashed_password: hashPassword,
//         }
//       );
//       let userData = await User.findOne({ email: current_user.email });

//       let token = jwt.sign({data: userData},"process.env.SAN_SECRET",{ expiresIn: "24h" });
//       return res.status(200).send({
//         message: "password successfully updated",
//         data: userData,
//         token: token,
//       });} else {
//       return res.status(400).send({
//         message: err.message,
//         data: err,
//       });
//     }
//   } catch (err) {
//     return res.status(400).send({
//       message: err.message,
//       data: err,
//     });
//   }
// };

// exports.changeUserPassword = async function(req,res){
//   try{
//     const email = req.body.email;
//     const currentPassword = req.body.hashed_password;
//     const newPassword =req.body.newPassword;
//     const data = await User.findOne({email:email});
//     if(data){
//       const Password = await bcrypt.hashSync(newPassword, 10)
//       const userData = User.findOneAndUpdate({email:email},{$set:{
//         newPassword:Password
//       }});
//       res.send(200).json({success:true,message:"your password is updated"});
//     }
//     else{
//       res.status(200).send({success:false, message:"user id not found"});
//     }
//   }
// catch(error){
//   res.status(400).send({message:error});
// }
// }
