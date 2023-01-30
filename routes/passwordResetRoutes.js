const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

router.route("/forgotpassword").post(passwordResetController.resetPassword);

module.exports = router;
