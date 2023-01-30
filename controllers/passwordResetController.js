const User = require("../models/userModel");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.MAIL_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: "khanshaheer43@gmail.com",
  name: "Sha FinTech",
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    if (user) {
    } else {
      res.status(404).json({
        status: "fail",
        message:
          "User with this mail Id no longer exist please use the correct mail id you had provided",
      });
    }

    const receivers = [
      {
        email: email,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password reset link",
      textContent: "This mail contains password rest link",
    });
    res.status(202).json({
      status: "success",
      message: "Password reset link has send to you via email successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
