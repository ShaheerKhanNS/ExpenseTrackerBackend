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
      status: "success",
      data: {
        name,
        email,
        password,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};
