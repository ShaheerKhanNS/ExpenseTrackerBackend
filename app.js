const express = require("express");
const bodyParser = require("body-parser");
const expenseRouter = require("./routes/expenseRoutes");
const userRouter = require("./routes/userRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const premiumRouter = require("./routes/premiumRoutes");
const passwordResetRouter = require("./routes/passwordResetRoutes");
const sequelize = require("./util/database");
const cors = require("cors");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");
const forgotPassword = require("./models/forgotPasswordModel");
const dotenv = require("dotenv");
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

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`App running on ${port}`);
    });
  })
  .catch((err) => console.log(err.message));
