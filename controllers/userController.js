const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 12, async (err, hash) => {
      await User.create({
        name,
        email,
        password: hash,
      });
      res.status(201).json({ message: "Successfully create new user" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const userPassword = user.dataValues.password;
      bcrypt.compare(password, userPassword, (err, result) => {
        if (err) {
          res.status(500).json({
            status: "fail",
            message: "Something went wrong",
          });
        } else if (result === true) {
          res.status(202).json({
            status: "success",
            message: "Logged In succesffully",
          });
        } else {
          res.status(401).json({
            status: "fail",
            message: "Unauthorized",
          });
        }
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User Not Found",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};
