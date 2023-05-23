const Invoice = require("../../models/sales/invoices.model");

// create task
exports.createInvoice = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const invoice = new Invoice(req.body);
    await invoice.save();
    return res.json({
      success: true,
      data: invoice,
      msg: "invoice added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

exports.listInvoices = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Invoice.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const invoices = await Invoice.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (invoices) {
      res.status(200).send({
        success: true,
        message: "invoices Fetched Successfully",
        data: invoices,
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

exports.viewInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.findById(req.params.id);
    res.json(invoices);
  } catch (err) {
    res.send("Error " + err);
  }
};

exports.editInvoice = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateFields = req.body;

    const updatedInovice = await Invoice.findByIdAndUpdate(
      taskId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedInovice) {
      return res
        .status(404)
        .json({ message: "task with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedInovice,
      msg: "task updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task by ID
exports.deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await Invoice.findByIdAndDelete(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "invoice not found" });
    }

    res.json({
      success: true,
      message: "invoice deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting invoice");
  }
};
