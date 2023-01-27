const express = require("express");
const bodyParser = require("body-parser");
const expenseRouter = require("./routes/expenseRoutes");
const userRouter = require("./routes/userRoutes");
const sequelize = require("./util/database");
const cors = require("cors");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/users", userRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`App running on ${port}`);
    });
  })
  .catch((err) => console.log(err.message));
