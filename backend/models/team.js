const mongoose = require("mongoose");
const { eventSchema } = require("./event");

const teamSchema = new mongoose.Schema({
  name: String,
  admins: Array,
  players: Array,
  events: [eventSchema],
});

const TeamEntity = mongoose.model("teamEntity", teamSchema);

module.exports = TeamEntity;
