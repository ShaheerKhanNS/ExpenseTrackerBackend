const User = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "success UserCreated",
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
      if (user.dataValues.password == password) {
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
    }
    res.status(404).json({
      status: "fail",
      message: "User Not Found",
    });
  } catch (err) {
    console.log(err.message);
  }
};
