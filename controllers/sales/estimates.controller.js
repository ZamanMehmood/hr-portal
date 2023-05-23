// const Payment = require("../../models/sales/payments.model");
// const Estimate = require("../../models/sales/");
const Estimate = require("../../models/sales/estimates.model");

// create task
exports.addEstimate = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const estimate = new Estimate(req.body);
    await estimate.save();
    return res.json({
      success: true,
      data: estimate,
      msg: "estimate added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// list payments
exports.listEstimates = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Estimate.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const estimates = await Estimate.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (estimates) {
      res.status(200).send({
        success: true,
        message: "estimates Fetched Successfully",
        data: estimates,
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
exports.viewEstimate = async (req, res) => {
  try {
    const payments = await Estimate.findById(req.params.id);
    res.json(payments);
  } catch (err) {
    res.send("Error " + err);
  }
};
// edit payment
exports.editEstimate = async (req, res) => {
  try {
    const estimateId = req.params.id;
    const updateFields = req.body;

    const updatedEstimate = await Estimate.findByIdAndUpdate(
      estimateId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedEstimate) {
      return res
        .status(404)
        .json({ message: "estimate with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedEstimate,
      msg: "estimate updated successfully",
    });
  } catch (err) {
    console.log("Err ---->", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a estimate by ID
exports.deleteEstimate = async (req, res) => {
  try {
    const estimateId = req.params.id;
    const esimate = await Estimate.findByIdAndDelete(estimateId);

    if (!esimate) {
      return res.status(404).json({ message: "esimate not found" });
    }
    res.json({
      success: true,
      message: "esimate deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting esimate");
  }
};
