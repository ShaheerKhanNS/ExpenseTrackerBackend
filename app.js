const express = require("express");
const bodyParser = require("body-parser");
const expenseRouter = require("./routes/expenseRoutes");
const userRouter = require("./routes/userRoutes");
const sequelize = require("./util/database");
const cors = require("cors");
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/users", userRouter);

sequelize
  .sync()
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App running on ${port}`);
    });
  })
  .catch((err) => console.log(err.message));
