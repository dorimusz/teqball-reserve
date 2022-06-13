const router = require("express").Router();
const {
  getMyTeams,
  getAllTeams,
  getSelectedTeam,
  joinToTeam,
  makeMeGod,
  createEvent,
  removeFromTeam,
} = require("../controllers/dashboard");

//
//router.get("/", dashboard);
router.get("/myteams", getMyTeams);
router.get("/allteams", getAllTeams);
router.post("/join", joinToTeam);
router.post("/team", getSelectedTeam);
router.post("/makemegod", makeMeGod);
router.post("/team/remove", removeFromTeam);
router.post("/event/create", createEvent);

module.exports = router;
