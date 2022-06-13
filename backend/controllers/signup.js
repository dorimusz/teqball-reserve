require("dotenv").config();
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");
const AuthEntity = require("../models/user");

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const checkEmail = async (req, res) => {
  const email = req.body.email;
  const query = await AuthEntity.findOne({ email: email });
  if (!query) return res.sendStatus(200);
  return res.status(409).json(query);
};

const checkUsername = async (req, res) => {
  const username = req.body.username;
  const query = await AuthEntity.findOne({ username: username });
  if (!query) return res.sendStatus(200);
  return res.status(409).json(query);
};

const register = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) return res.sendStatus(400);

  const hashedPassword = await hashPassword(req.body.password);
  const newUser = new AuthEntity({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    date: new Date().getTime(),
    randomCode: randomBytes(256).toString("hex"),
  });
  await newUser.save().catch((err) => {
    return res.status(500).json(err);
  });
  return res.status(200).json(req.body.username);
};

exports.checkEmail = checkEmail;
exports.checkUsername = checkUsername;
exports.register = register;

/*
const randomCode = randomBytes(256).toString("hex");
const date = new Date().getTime(); // + 300000
*/
