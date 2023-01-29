const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.showleaderboard = async (req, res) => {
  const user = await User.findAll();
  const expenses = await Expense.findAll();

  const aggregatedExpense = {};

  expenses.forEach((expense) => {
    if (aggregatedExpense[expense.userId]) {
      aggregatedExpense[expense.userId] += expense.price;
    }

    aggregatedExpense[expense.userId] = expense.price;
  });

  const leaderBoard = [];

  user.forEach((user) => {
    leaderBoard.push({
      name: user.name,
      total_cost: aggregatedExpense[user.id] || 0,
    });
  });

  const sorted = leaderBoard.sort((a, b) => b.total_cost - a.total_cost);

  res.status(200).json({
    status: "success",
    data: sorted,
  });
};
