const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const S3service = require("../services/s3Service");
const Download = require("../models/downloadModel");

exports.getAllExpenses = async (req, res) => {
  const page = +req.query.page || 1;
  const ITEMS_PER_PAGE = +req.query.size || 2;
  // For implementing how many buttons we need to render we are taking the total number of entries.
  let totalItems = await Expense.count({
    where: {
      userId: req.user.id,
    },
  });

  //  For pagination feature
  const expenses = await Expense.findAll({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
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
      // For displaying the name of currently logged in user
      name: user.name,
      // For pagination purpose
      page: {
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      },
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
  try {
    // For security purpose we only allow the user who created the expense to delete, this is done by identifying the user using token and authorizing him

    const id = req.params.id;
    await Expense.destroy({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    res.status(202).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Unauthorized",
    });
  }
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
