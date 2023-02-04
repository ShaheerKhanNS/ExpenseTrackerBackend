//Required npm modules
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

//Routes
const expenseRouter = require("./routes/expenseRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const userRouter = require("./routes/userRoutes");
const premiumRouter = require("./routes/premiumRoutes");
const passwordResetRouter = require("./routes/passwordResetRoutes");

//Database and HTTPS middleware
const sequelize = require("./util/database");
const cors = require("cors");
//Starting app
const app = express();
//Models
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/orderModel");
const Download = require("./models/downloadModel");
const forgotPassword = require("./models/forgotPasswordModel");

dotenv.config({ path: "./config.env" });

const accessStreamLog = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Essential middleware configarations
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("combined", { stream: accessStreamLog }));
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
