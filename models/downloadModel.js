const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downloadExpenseSchema = new Schema({
  fileUrl: {
    type: String,
    required: [true, "Download link needs to have a Url"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DownloadedExpense", downloadExpenseSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Download = sequelize.define("expensedownload", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },

//   fileUrl: {
//     type: Sequelize.STRING,
//   },

//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   date: {
//     allowNull: false,
//     type: Sequelize.DATE,
//     defaultValue: Sequelize.fn("now"),
//   },
// });

// module.exports = Download;
