// const Payment = require("../../models/sales/payments.model");
const Payment = require("../../models/sales/payments.model");

// create task
exports.addPayment = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const payment = new Payment(req.body);
    await payment.save();
    return res.json({
      success: true,
      data: payment,
      msg: "payment added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// list payments
exports.listPayments = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Payment.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const payments = await Payment.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (payments) {
      res.status(200).send({
        success: true,
        message: "payments Fetched Successfully",
        data: payments,
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
// view payments
exports.viewPayment = async (req, res) => {
  try {
    const payments = await Payment.findById(req.params.id);
    res.json(payments);
  } catch (err) {
    res.send("Error " + err);
  }
};
// edit payment
exports.editPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const updateFields = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedPayment) {
      return res
        .status(404)
        .json({ message: "payment with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedPayment,
      msg: "payment updated successfully",
    });
  } catch (err) {
    console.log("Err ---->", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "payment not found" });
    }
    res.json({
      success: true,
      message: "payment deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting payment");
  }
};
