const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  teamName: String,
  title: String,
  location: String,
  dateFrom: String,
  dateTo: String,
  players: Array,
});

const EventEntity = mongoose.model("eventEntity", eventSchema);

exports.EventEntity = EventEntity;
exports.eventSchema = eventSchema;
