const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  team: Array,
  googleCalendarAccessToken: String,
});

const AuthEntity = mongoose.model("authEntity", userSchema);

module.exports = AuthEntity;
