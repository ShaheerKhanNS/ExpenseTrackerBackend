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
  .get(expenseController.getExpense)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
