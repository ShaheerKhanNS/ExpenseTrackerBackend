const express = require("express");
const expenseController = require("../controllers/expenseController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/addexpense")
  .post(authController.whichUser, expenseController.createExpense);

router
  .route("/")
  .get(authController.whichUser, expenseController.getAllExpenses);

router
  .route("/:id")
  .delete(authController.whichUser, expenseController.deleteExpense);

module.exports = router;
