require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthEntity = require("../models/user");

const checkPassword = async (password, hash) => {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
};

const generateToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
  return token;
};

const login = async (req, res) => {
  if (!req.body.credentials || !req.body.password) return res.sendStatus(400);

  const loginField = req.body.credentials.includes("@") ? "email" : "username";
  const query = await AuthEntity.findOne({
    [loginField]: req.body.credentials,
  });
  if (!query) return res.sendStatus(401);

  const isValid = await checkPassword(req.body.password, query.password);
  if (!isValid) return res.sendStatus(401);

  const token = generateToken(query._id);

  return res.status(200).json(token);
};

exports.login = login;

/*

*/
