// NOT IN USE
const router = require("express").Router();
const { readPublic } = require("../controllers/public");

router.get("/", readPublic);

module.exports = router;
