const Expense = require("../models/expenseModel");

exports.getAllExpenses = async (req, res) => {
  const expenses = await Expense.findAll({
    where: {
      userId: req.user.id,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      expenses,
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

exports.getExpense = (req, res) => {
  res.send("get one expense");
};
exports.updateExpense = (req, res) => {
  res.send("update one expense");
};
exports.deleteExpense = async (req, res) => {
  const id = req.params.id;
  const expense = await Expense.findByPk(id);
  await expense.destroy();

  res.status(202).json({
    status: "success",
  });
};
