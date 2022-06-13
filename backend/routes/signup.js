const router = require("express").Router();
const { checkEmail, checkUsername, register } = require("../controllers/signup");

router.post("/", register);
router.post("/check_email", checkEmail);
router.post("/check_username", checkUsername);

module.exports = router;
