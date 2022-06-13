const Base = require("../models/base");

const readPublic = async (req, res) => {
  try {
    const response = await Base.findOne({ name: "Public" });
    return res.status(200).json(response.name);
  } catch (err) {
    return res.status(404);
  }
};

exports.readPublic = readPublic;
