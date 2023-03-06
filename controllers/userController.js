const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRETKEY);
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 12, async (err, hash) => {
      const user = new User({
        name,
        email,
        password: hash,
      });
      try {
        await user.save();
        res.status(201).json({ message: "Successfully create new user" });
      } catch (err) {
        res.status(400).json({
          status: "fail",
          message: "User with this mail Id exists please use signin option.",
        });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const userPassword = user.password;

      bcrypt.compare(password, userPassword, (err, result) => {
        if (err) {
          res.status(500).json({
            status: "fail",
            message: "Something went wrong",
          });
        } else if (result === true) {
          res.status(200).json({
            status: "success",
            message: "Logged In succesffully",
            token: generateAccessToken(user._id),
          });
        } else {
          res.status(401).json({
            status: "fail",
            message: "Unauthorized/Please enter the correct Password",
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

// For sequelize and SQL DB

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ where: { email: email } });
//     if (user) {
//       const userPassword = user.dataValues.password;
//       bcrypt.compare(password, userPassword, (err, result) => {
//         if (err) {
//           res.status(500).json({
//             status: "fail",
//             message: "Something went wrong",
//           });
//         } else if (result === true) {
//           res.status(200).json({
//             status: "success",
//             message: "Logged In succesffully",
//             token: generateAccessToken(user.id),
//           });
//         } else {
//           res.status(401).json({
//             status: "fail",
//             message: "Unauthorized",
//           });
//         }
//       });
//     } else {
//       res.status(404).json({
//         status: "fail",
//         message: "User Not Found",
//       });
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// };
