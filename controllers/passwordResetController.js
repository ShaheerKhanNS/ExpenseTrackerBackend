const User = require("../models/userModel");
const Sib = require("sib-api-v3-sdk");
const forgotPasswrdMdl = require("../models/forgotPasswordModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.resetPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    if (user.length === 0) {
      res.status(404).json({
        status: "fail",
        message:
          "User with this mail Id no longer exist please use the correct mail id you had provided",
      });
    }

    if (user.length !== 0) {
      const id = uuidv4();

      await forgotPasswrdMdl.create({
        id,
        userId: user[0].dataValues.id,
        isActive: true,
      });

      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.MAIL_API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: "khanshaheer43@gmail.com",
        name: "Sha FinTech",
      };

      const receivers = [
        {
          email: email,
        },
      ];

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "Password reset link",
          textContent: `Please use this link for changing your password `,
          htmlContent: `<h3>Reset Your Password</h3>
                      <a href="http://localhost:3000/api/v1/password/resetPassword/${id}">Click here </a>                     `,
        })
        .then(() => {
          res.status(202).json({
            status: "success",
            message:
              "Password reset link has send to you via email successfully",
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.resetPasswordPage = async (req, res) => {
  const uid = req.params.id;
  const request = await forgotPasswrdMdl.findAll({
    where: {
      id: uid,
    },
  });

  if (request[0].dataValues.isActive === true) {
    await request[0].update({ isActive: false });
    request[0].save();
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="icon"
      type="image/png"
      href="https://cdn-icons-png.flaticon.com/512/5501/5501391.png"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
      crossorigin="anonymous"
    />

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
      crossorigin="anonymous"
    ></script>
    <style>
      body {
        font-family: "Inter", sans-serif;
        background-color: #c7ecee;
      }
      div {
        margin-top: 150px;
        width: 50%;
      }
      button {
        margin-top: 20px;
      }
    </style>

    <title>Change your password</title>
  </head>
  <body>
    <div class="container">
      <form  class="form-control form-control-sm">
        <label for="password" class="form-label">NewPassword:</label>
        <input type="password" id="password" class="form-control" required />
        <button class="btn btn-signup btn-primary">Reset Password</button>
      </form>
    </div>
  <script >
 

const btnSubmit = document.querySelector(".btn");

btnSubmit.addEventListener("click", async (e) => {
  try{

    e.preventDefault();
    const password = document.getElementById("password").value;
    
    if (password) {
   const response =   await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/password/updatePassword/${uid}",
        data:{
          password
        }
      });
       alert(response.data.message);
      window.location.replace("http://127.0.0.1:8080/html/login.html");
    }
    
  }catch(err){
   alert(err.message) 
  }
});</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
  </body>
</html>
`);
  } else if (request[0].dataValues.isActive === false) {
    res.redirect("http://127.0.0.1:8080/html/error.html");
  }
};

exports.updatePassword = async (req, res) => {
  const uid = req.params.id;
  const { password } = req.body;

  const request = await forgotPasswrdMdl.findAll({
    where: {
      id: uid,
    },
  });
  const user = await User.findAll({
    where: {
      id: request[0].userId,
    },
  });

  // console.log("user====>", user);
  // console.log("request====>", request);

  bcrypt.hash(password, 12, async (err, hash) => {
    await user[0].update({ password: hash });
    await user[0].save();
  });

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
};
