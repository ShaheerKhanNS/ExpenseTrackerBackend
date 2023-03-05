// const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
// const sequelize = require("../util/database");

exports.showleaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort("-totalExpense")
      .select("-_id name totalExpense");

    res.status(201).json({
      status: "sucess",
      users,
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.showleaderboard = async (req, res) => {
//   try {
//     // This method will be suit only for few users and is not efficient
//     // const userAggregatedExpense = await User.findAll({
//     //   attributes: [
//     //     "id",
//     //     "name",
//     //     [sequelize.fn("sum", sequelize.col("expenses.price")), "total_cost"],
//     //   ],
//     //   include: [
//     //     {
//     //       model: Expense,
//     //       attributes: [],
//     //     },
//     //   ],
//     //   group: ["id"],

//     //   order: [["total_cost", "DESC"]],
//     // });

//     // Optimization by adding a totalexpennse coloumn in user table

//     const userAggregatedExpense = await User.findAll({
//       order: [["totalexpense", "DESC"]],
//     });

//     res.status(201).json({
//       status: "sucess",
//       userAggregatedExpense,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };
