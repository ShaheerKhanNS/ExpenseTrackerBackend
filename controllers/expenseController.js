const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const S3service = require("../services/s3Service");
const Download = require("../models/downloadModel");

exports.getAllExpenses = async (req, res) => {
  const expenses = await Expense.findAll({
    where: {
      userId: req.user.id,
    },
  });

  const user = await User.findByPk(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      expenses,
      premium: user.isPremium,
      name: user.name,
    },
  });
};

exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { price, description, category } = req.body;
    await Expense.create({
      price,
      description,
      category,
      userId,
    });
    res.status(201).json({ message: "Successfully created Expense" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  const expense = await Expense.findByPk(id);
  await expense.destroy();

  res.status(202).json({
    status: "success",
  });
};

exports.downloadExpense = async (req, res) => {
  try {
    // Getting id of the current logged in user,by using a middlewarefunction.
    const id = req.user.dataValues.id;
    // Getting all the expenses for the given userId
    const expenses = await Expense.findAll({
      where: {
        userId: id,
      },
    });

    const filename = `Expense${id}/${new Date()}.txt`;
    const data = JSON.stringify(expenses);
    const fileUrl = await S3service.uploadToS3(data, filename);

    await Download.create({
      fileUrl: fileUrl,
      userId: id,
    });

    res.status(200).json({
      status: "success",
      fileUrl,
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
