require("dotenv").config();
const jwt = require("jsonwebtoken");
const http = require("axios");
const User = require("../models/user");
const Team = require("../models/team");
const { EventEntity } = require("../models/event");

const verifyToken = (token) => {
  let verified;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return (verified = false);
    verified = decoded;
  });
  return verified;
};

// const dashboard = async (req, res) => {
//   if (!req.headers) return res.sendStatus(401);
//   const verified = verifyToken(req.headers.authorization);
//   if (!verified) return res.sendStatus(401);

//   const response = await Base.findOne({ name: "Private" });
//   return res.status(200).json(response.name);
// };

const getMyTeams = async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  const userId = verified.id;
  const teams = await User.findOne({ _id: userId }, "-password"); /* .select("team") */
  return res.status(200).json(teams);
};

const getAllTeams = async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  const userId = verified.id;
  const teams = await Team.find();
  return res.status(200).json(teams);
};

const joinToTeam = async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  console.log(req.body);
  const userId = verified.id;
  const user = await User.findOne({ _id: userId });
  const team = await Team.findOne({ name: req.body.teamname });
  user.team.push(req.body.teamname);
  user.save(User);
  team.players.push(req.body.name);
  team.save(Team);
  return res.sendStatus(200);
};

const getSelectedTeam = async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  const team = await Team.findOne({ name: req.body.teamname });
  return res.status(200).json(team);
};

const makeMeGod = async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  const team = await Team.findOne({ name: req.body.teamname });
  team.admins.push(req.body.name);
  team.save(Team);
  return res.status(200).json(team);
};

const removeFromTeam = async (req, res) => {
  if (!req.headers) return res.sendStatus(401);
  const verified = verifyToken(req.headers.authorization);
  if (!verified) return res.sendStatus(401);

  const userId = verified.id;
  const user = await User.findOne({ _id: userId });
  const team = await Team.findOne({ name: req.body.teamname });
  user.team.pull(req.body.teamname);
  team.admins.pull(user.username);
  team.players.pull(user.username);
  user.save(User);
  team.save(Team);
  console.log(team);
  return res.status(200).json(team);
};

const createEvent = async (req, res) => {
  try {
    if (!req.headers) return res.sendStatus(401);
    const verified = verifyToken(req.headers.authorization);
    if (!verified) return res.sendStatus(401);

    const existingEvent = await EventEntity.findOne({ title: req.body.title }, "title -_id");
    if (existingEvent !== null && existingEvent.title === req.body.title) return res.sendStatus(409);

    const userId = verified.id;
    const user = await User.findOne({ _id: userId });
    /* const newTeam = new Team({
      name: name,
      admins: user.username,
      players: user.username,
    }); */
    const newEvent = new EventEntity({
      teamName: req.body.teamname,
      title: req.body.title,
      location: req.body.location,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      players: user.username,
    });
    await newEvent.save().catch((err) => {
      return res.status(500).json(err);
    });

    // google
    try {
      const googleResponse = await http.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          summary: newEvent.title,
          description: newEvent.teamName,
          location: newEvent.location,
          colorId: "6",
          start: {
            dateTime: new Date(),
          },
          end: {
            dateTime: new Date(),
          },
        },
        {
          headers: {
            authorization: "Bearer " + user.googleCalendarAccessToken,
          },
        }
      );
      console.log(googleResponse.data);
    } catch (err) {
      console.log("ezt keressuk", err.response.data.error.errors);
    }

    const team = await Team.findOne({
      name: req.body.teamname,
    });
    team.events.push(newEvent);
    // console.log(team);
    team.save().catch((err) => {
      return res.status(500).json(err);
    });
    res.status(200).json(team);
  } catch (error) {
    console.log("????", error);
    res.sendStatus(400);
  }
};

// exports.dashboard = dashboard;
exports.getMyTeams = getMyTeams;
exports.getAllTeams = getAllTeams;
exports.joinToTeam = joinToTeam;
exports.getSelectedTeam = getSelectedTeam;
exports.makeMeGod = makeMeGod;
exports.removeFromTeam = removeFromTeam;
exports.createEvent = createEvent;
