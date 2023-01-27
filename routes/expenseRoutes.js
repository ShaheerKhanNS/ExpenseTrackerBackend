const express = require("express");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

router.route("/addexpense").post(expenseController.createExpense);

router.route("/").get(expenseController.getAllExpenses);

router
  .route("/:id")
  .get(expenseController.getExpense)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
