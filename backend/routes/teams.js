const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Team = require("../models/team");

const verifyToken = (token) => {
  let verified;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return (verified = false);
    verified = decoded;
  });
  return verified;
};
// const { team } = require("../controllers/team");

// router.get("/", team);

// router.get("/add", (req, res) => {
//   res.send("GET request to the homepage");
// });

router.post("/add", async (req, res) => {
  try {
    if (!req.headers) return res.sendStatus(401);
    const verified = verifyToken(req.headers.authorization);
    if (!verified) return res.sendStatus(401);

    const name = req.body.name;
    if (!name) return res.json("data is missing").status(400);

    const incomingName = await Team.findOne({ name: name });
    if (incomingName)
      return res.status(406).json("This team name is already occupied");

    const user = await User.findOne({ _id: verified.id });

    user.team.push(req.body.name);
    user.save(User);

    const newTeam = new Team({
      name: name,
      admins: user.username,
      players: user.username,
    });

    await newTeam.save().catch((err) => {
      return res.status(500).json(err);
    });
    return res.status(200).json("Created " + req.body.name);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
