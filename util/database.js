const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "expense-tracker-complete",
  "root",
  "shaheerkhanns@NODE",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
