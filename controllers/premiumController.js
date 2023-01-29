const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");

exports.showleaderboard = async (req, res) => {
  try {
    const userAggregatedExpense = await User.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("sum", sequelize.col("expenses.price")), "total_cost"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["id"],

      order: [["total_cost", "DESC"]],
    });

    res.status(201).json({
      status: "sucess",
      userAggregatedExpense,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
