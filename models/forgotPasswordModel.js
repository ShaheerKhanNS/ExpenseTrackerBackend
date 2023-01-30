const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const forgotPassword = sequelize.define("ForgotPasswordRequests", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },

  userId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = forgotPassword;
