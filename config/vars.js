const path = require("path");
// import .env variables
require("dotenv").config();
module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  jwtResetPassSecret: process.env.RESET_PASSWORD_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
};
