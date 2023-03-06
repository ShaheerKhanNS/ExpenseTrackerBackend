const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.whichUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    const user = await User.findById(decodedToken.userId);

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
};

// Sequelize SQL

// exports.whichUser = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization");
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

//     // Finding The user

//     const user = await User.findByPk(decodedToken.userId);

//     req.user = user;

//     next();
//   } catch (err) {
//     res.status(401).json({
//       status: "failed",
//       message: "Unauthorized",
//     });
//   }
// };
