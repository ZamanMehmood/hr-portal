const Expense = require("../../models/sales/expenses.model");

// create expense
// exports.addExpense = async (req, res, next) => {
//   try {
//     console.log("REq.body", req.body, req.file);
//     // create a new record in db
//     const expense = new Expense(req.body);
//     await expense.save();
//     return res.json({
//       success: true,
//       data: expense,
//       msg: "expense added sunccessfully",
//     });
//   } catch (err) {
//     console.log("Error handling ===>", err);
//     next();
//   }
// };

// exports.addExpense = async (req, res, next) => {
//   try {
//     console.log("REq.body", req.body, req.file);
//     //create new user in db
//     let expense = new Expense({
//       description: req.body.description,
//       date: req.body.date,
//       amount: req.body.amount,
//       category: req.body.category,
//       project: req.body.project,
//       teamMember: req.body.teamMember,
//       billable: req.body.billable,
//       receiptFile: req.file.filename,
//     });

//     //save the expense in db
//     expense = await expense.save();

//     return res.json({
//       success: true,
//       data: expense,
//       msg: "expense created successfully",
//     });
//   } catch (err) {
//     console.log("Error handling =>", err);
//     next();
//   }
// };

exports.addExpense = async (req, res, next) => {
  try {
    console.log("Req.body", req.body, req.file);
    // Create new Expense instance
    let expense = new Expense({
      description: req.body.description,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      project: req.body.project,
      teamMember: req.body.teamMember,
      billable: req.body.billable,
      receiptFile: req.file.filename,
    });

    // Save the expense in the database
    expense = await expense.save();

    return res.json({
      success: true,
      data: expense,
      msg: "Expense created successfully",
    });
  } catch (err) {
    console.log("Error handling =>", err);
    next(err);
  }
};

// list expenses
exports.listExpenses = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Expense.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const expenses = await Expense.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (expenses) {
      res.status(200).send({
        success: true,
        message: "expenses Fetched Successfully",
        data: expenses,
        total: total,
        pagination: {
          page,
          pageLimit,
          total,
          pages:
            Math.ceil(total / pageLimit) <= 0
              ? 1
              : Math.ceil(total / pageLimit),
        },
      });
    } else {
      res.status(400).send({ success: false, message: "Data not fetched" });
    }
  } catch (err) {
    return res.json({
      success: false,
      msg: "Something is wrong in catch block",
    });
  }
};
// view expenses
exports.viewExpense = async (req, res) => {
  try {
    const expenses = await Expense.findById(req.params.id);
    res.json(expenses);
  } catch (err) {
    res.send("Error " + err);
  }
};
// edit expense
exports.editExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const updateFields = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ message: "expense with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedExpense,
      msg: "expense updated successfully",
    });
  } catch (err) {
    console.log("Err ---->", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({
      success: true,
      message: "expense deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting expense");
  }
};
