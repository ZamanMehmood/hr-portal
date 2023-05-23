const mongoose = require("mongoose");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const { jwtSecret, jwtExpirationInterval } = require("../config/vars");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
});

// The token() method generates a JSON Web Token (JWT) using the jwt.encode()
userSchema.method({
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "seconds").unix(), // expiration time
      iat: moment().unix(), // iat: the time at which the JWT was issued, also in Unix time.
      sub: this._id, // unique identifier of the user
    };
    return jwt.encode(playload, jwtSecret);
  },
});

module.exports = mongoose.model("User", userSchema);
