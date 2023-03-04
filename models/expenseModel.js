const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    required: [true, "An expense must have a price"],
  },
  description: {
    type: String,
    required: [true, "An expense must have a description"],
  },
  category: {
    type: String,
    required: [true, "An Expense must belongs to a category"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Expense", expenseSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Expense = sequelize.define("expenses", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   date: {
//     allowNull: false,
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.fn("now"),
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Expense;
