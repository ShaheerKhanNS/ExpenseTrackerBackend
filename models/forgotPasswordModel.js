const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const forgotPassword = sequelize.define("ForgotPasswordRequests", {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },

//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   isActive: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//   },
// });

// module.exports = forgotPassword;
