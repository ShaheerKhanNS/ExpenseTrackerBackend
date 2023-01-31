const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const forgotPassword = sequelize.define("ForgotPasswordRequests", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },

  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = forgotPassword;
