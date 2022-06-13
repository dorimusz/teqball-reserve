const mongoose = require("mongoose");

const baseSchema = new mongoose.Schema({
  name: String,
});

const Base = mongoose.model("Base", baseSchema);

module.exports = Base;
