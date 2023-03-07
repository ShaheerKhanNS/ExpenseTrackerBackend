//Required npm modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./aws.env" });
const express = require("express");
const bodyParser = require("body-parser");

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
// const sequelize = require("./util/database");
const cors = require("cors");

//Starting app
const app = express();
//Models
// const User = require("./models/userModel");
// const Expense = require("./models/expenseModel");
// const Order = require("./models/orderModel");
// const Download = require("./models/downloadModel");
// const forgotPassword = require("./models/forgotPasswordModel");

const accessStreamLog = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Essential middleware configarations
app.use(cors());

app.use(express.json());
app.use(morgan("combined", { stream: accessStreamLog }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/premium", premiumRouter);
app.use("/api/v1/password", passwordResetRouter);
// app.use((req, res) => {
//   res

//     .setHeader(
//       "Content-Security-Policy",
//       "form-action https://127.0.0.1:3000/api/v1/password/resetPassword",
//       "script-src  https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js https://checkout.razorpay.com/v1/checkout.js",
//       "img-src  https://cdn-icons-png.flaticon.com/512/5501/5501391.png"
//     )
//     .sendFile(path.join(__dirname, `public${req.url}`));
// });
app.use((req, res) => {
  res

    .setHeader(
      "Content-Security-Policy",
      "form-action http://35.78.245.211:3000/api/v1/password/resetPassword",
      "script-src  https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js https://checkout.razorpay.com/v1/checkout.js",
      "img-src  https://cdn-icons-png.flaticon.com/512/5501/5501391.png"
    )
    .sendFile(path.join(__dirname, `public${req.url}`));
});

// Table Relationships In SQL

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(forgotPassword);
// forgotPassword.belongsTo(User);

// User.hasMany(Download);
// Download.belongsTo(User);

// sequelize
//   .sync()
//   .then(() => {
//     const port = process.env.PORT;
//     app.listen(port, () => {
//       console.log(`App running on ${port}`);
//     });
//   })
//   .catch((err) => console.log(err.message));

mongoose
  .connect(process.env.MONGO_DB_STRING)
  .then((res) => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`App running on ${port}`);
    });
  })
  .catch((err) => console.log(err));
