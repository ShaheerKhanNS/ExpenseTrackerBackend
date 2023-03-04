const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const S3service = require("../services/s3Service");
const Download = require("../models/downloadModel");

exports.getAllExpenses = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = +req.query.size || 2;

    let totalItems = await Expense.countDocuments({ userId: req.user.id });

    const expenses = await Expense.find({ userId: req.user.id })
      .populate("userId")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (expenses.length === 0) {
      const user = await User.findById(req.user.id);
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
    } else {
      res.status(200).json({
        status: "success",
        data: {
          expenses,
          premium: expenses[0].userId.isPremium,
          // For displaying the name of currently logged in user
          name: expenses[0].userId.name || req.user.name,
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
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
    });
  }
};

// exports.getAllExpenses = async (req, res) => {
//   const page = +req.query.page || 1;
// const ITEMS_PER_PAGE = +req.query.size || 2;
//   // For implementing how many buttons we need to render we are taking the total number of entries.
//   let totalItems = await Expense.count({
//     where: {
//       userId: req.user.id,
//     },
//   });

//   //  For pagination feature
//   const expenses = await Expense.findAll({
//     offset: (page - 1) * ITEMS_PER_PAGE,
//     limit: ITEMS_PER_PAGE,
//     where: {
//       userId: req.user.id,
//     },
//   });

//   const user = await User.findByPk(req.user.id);

//   res.status(200).json({
//     status: "success",
//     data: {
//       expenses,
//       premium: user.isPremium,
//       // For displaying the name of currently logged in user
//       name: user.name,
//       // For pagination purpose
//       page: {
//         currentPage: page,
//         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//         nextPage: page + 1,
//         hasPreviousPage: page > 1,
//         previousPage: page - 1,
//         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
//       },
//     },
//   });
// };

exports.createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { price, description, category } = req.body;

    const user = await User.findById(userId);
    const totalexpense = user.totalExpense + Number(price);

    const expense = new Expense({
      price,
      description,
      category,
      userId,
    });

    user.totalExpense = totalexpense;
    await user.save();
    await expense.save();

    res.status(201).json({ message: "Successfully created Expense" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// exports.createExpense = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findAll({
//       where: {
//         id: userId,
//       },
//     });
//     const { price, description, category } = req.body;

//     const totalexpense = user[0].totalexpense + Number(price);
//     await user[0].update({
//       totalexpense: totalexpense,
//     });

//     await Expense.create({
//       price,
//       description,
//       category,
//       userId,
//     });
//     res.status(201).json({ message: "Successfully created Expense" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.deleteExpense = async (req, res) => {
  try {
    const _id = req.params.id;

    await Expense.findByIdAndDelete(_id);

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

// exports.deleteExpense = async (req, res) => {
//   try {
//     // For security purpose we only allow the user who created the expense to delete, this is done by identifying the user using token and authorizing him

//     const id = req.params.id;
//     await Expense.destroy({
//       where: {
//         id: id,
//         userId: req.user.id,
//       },
//     });

//     res.status(202).json({
//       status: "success",
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "fail",
//       message: "Unauthorized",
//     });
//   }
// };

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user.id,
    }).select("-_id price description category date");

    const filename = `Expense${req.user.id}/${new Date()}.txt`;
    const data = JSON.stringify(expenses);
    const fileUrl = await S3service.uploadToS3(data, filename);

    const downloadExpense = new Download({
      fileUrl,
      userId: req.user.id,
    });

    downloadExpense.save();

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

// exports.downloadExpense = async (req, res) => {
//   try {
//     // Getting id of the current logged in user,by using a middlewarefunction.
//     const id = req.user.id;

//     // Getting all the expenses for the given userId
//     const expenses = await Expense.findAll({
//       where: {
//         userId: id,
//       },
//     });

//     const filename = `Expense${id}/${new Date()}.txt`;
//     const data = JSON.stringify(expenses);
//     const fileUrl = await S3service.uploadToS3(data, filename);

//     await Download.create({
//       fileUrl: fileUrl,
//       userId: id,
//     });

//     res.status(200).json({
//       status: "success",
//       fileUrl,
//     });
//   } catch (err) {
//     console.log(JSON.stringify(err));
//     res.status(500).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };
