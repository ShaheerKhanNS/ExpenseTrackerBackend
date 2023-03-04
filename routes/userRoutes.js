const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

router.route("/").post(userController.createUser);
router.route("/login").post(userController.login);
router
  .route("/download")
  .get(authController.whichUser, expenseController.downloadExpense);

module.exports = router;
