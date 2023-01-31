//Required npm modules
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

//Routes
const expenseRouter = require("./routes/expenseRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const userRouter = require("./routes/userRoutes");
const premiumRouter = require("./routes/premiumRoutes");
const passwordResetRouter = require("./routes/passwordResetRoutes");

//Database and HTTPS middleware
const sequelize = require("./util/database");
const cors = require("cors");

//Models
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");
const Download = require("./models/downloadModel");
const forgotPassword = require("./models/forgotPasswordModel");

// Essential middleware configarations
dotenv.config({ path: "./config.env" });
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/premium", premiumRouter);
app.use("/api/v1/password", passwordResetRouter);

// Table Relationships
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`App running on ${port}`);
    });
  })
  .catch((err) => console.log(err.message));
