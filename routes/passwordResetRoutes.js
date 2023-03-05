const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordResetController");

router.route("/forgotpassword").post(passwordController.resetPasswordLink);
router.route("/resetPassword/:id").get(passwordController.resetPasswordPage);
router.route("/updatePassword/:id").post(passwordController.updatePassword);

module.exports = router;
