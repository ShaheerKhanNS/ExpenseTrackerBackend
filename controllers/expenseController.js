exports.getAllExpenses = (req, res) => {
  res.send("Getting all expenses");
};

exports.createExpense = (req, res) => {
  res.send("posting expenses");
};

exports.getExpense = (req, res) => {
  res.send("get one expense");
};
exports.updateExpense = (req, res) => {
  res.send("update one expense");
};
exports.deleteExpense = (req, res) => {
  res.send("delete one expense");
};
