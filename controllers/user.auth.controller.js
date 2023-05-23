const User = require("../models/user.auth.model");
// const { jwtSecret, jwtExpirationInterval } = require("../config/vars");
const {
  jwtResetPassSecret,
  emailUser,
  emailPass,
  emailHost,
} = require("../config/vars");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");

// signup / register
// exports.register = async (req, res, next) => {
//   try {
//     console.log("req.body", req.body);

//     const { email } = req.body;

//     // find if user exists
//     let user = await User.findOne({
//       email,
//     });

//     //already exist
//     if (user != null)
//       return res.send(
//         "this email already exists , you can not create with same id"
//       );

//     // create new user in db
//     user = new User({
//       name: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       gender: req.body.gender,
//       dateOfBirth: req.body.dateOfBirth,
//     });

//     // save user in db
//     await user.save();

//     var accessToken = await user.token();

//     console.log("access token ===>", accessToken);
//     return res.json({
//       accessToken,
//       success: true,
//       data: user,
//       msg: "user created sucessfully",
//     });
//   } catch (err) {
//     console.log("Error handling -->", err);
//     next();
//   }
// };

// const bcrypt = require("bcrypt");
// const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    console.log("req.body", req.body);

    const { email } = req.body;

    // find if user exists
    let user = await User.findOne({
      email,
    });

    // already exists
    if (user != null) {
      return res.send(
        "This email already exists. You cannot create a new account with the same email address."
      );
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user object with the hashed password
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
    });

    // Save the user object to the database
    await user.save();

    // Generate an access token for the user
    const accessToken = await user.token();

    console.log("access token ===>", accessToken);
    return res.json({
      accessToken,
      success: true,
      data: user,
      msg: "User created successfully.",
    });
  } catch (err) {
    console.log("Error handling -->", err);
    next();
  }
};

// login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find if user exist

    let user = await User.findOne({
      email,
    });

    if (!user) return res.json({ success: false, msg: "Email no exist" });

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.json({ success: false, msg: "incorrect password" });

    var accessToken = await user.token();

    console.log("access token ==>", accessToken);

    return res.json({
      accessToken,
      success: true,
      data: user,
      msg: "User logged In successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

// reset password
// exports.resetPassword = async (req, res) => {
//   try {
//     const { resetToken, newPassword } = req.body;

//     const decoded = jwt.decode(resetToken, jwtResetPassSecret);

//     const user = await User.findOne({ email: decoded.email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     user.password = hashedPassword;

//     await user.save();

//     return res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const decoded = jwt.decode(resetToken, jwtResetPassSecret);

    if (!decoded || !decoded.email) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.log("error in resetpassword -===>", err);
    // return res.status(500).json({ message: "Internal server error" });
  }
};

//1.sender 2.reciver
// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.encode(
      { email },
      jwtResetPassSecret, // reset password secret (random string)
      "HS256" // algorithm
      // {
      //   expiresIn: "1h",
      // }
    );
    console.log("resetToken in forgotPassword ===>", resetToken);

    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: 587,
      secure: false,
      auth: {
        user: emailUser, // from zaman342003@outlook.com
        pass: emailPass, // password of your outlook email account
      },
    });

    const mailOptions = {
      from: emailUser, // email sender    || zaman342003@outlook.com
      to: email, // email reciever passing email from postman raw (json)
      subject: "Password Reset Request",
      html: `<p>Please click <a href="http://localhost:8080/reset-password?token=${resetToken}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ message: "Email sent successfully" });
      }
    });
  } catch (err) {
    console.log("err handling in catch block ===>", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
