const Leads = require("../models/leads.model");

// create lead
exports.createLead = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const lead = new Leads(req.body);
    await lead.save();
    return res.json({
      success: true,
      data: lead,
      msg: "lead add sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};
exports.listLeads = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Leads.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const leads = await Leads.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (leads) {
      res.status(200).send({
        success: true,
        message: "Leads Fetched Successfully",
        data: leads,
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
    // res.send("Product Error " + err);
    return res.json({
      success: false,
      msg: "leads fetched successfully",
    });
  }
};

// exports.listProjects = async (req, res) => {
//   try {
//     console.log("req.query", req.query);
//     const filters = {};

//     // Check if company name filter is provided
//     if (req.query.client) {
//       filters.client = req.query.client;
//     }

//     // Check if email address filter is provided
//     if (req.query.startDate) {
//       filters.startDate = req.query.startDate;
//     }
//     const projects = await Project.find(filters);
//     res.json(projects);
//   } catch (err) {
//     res.send("Error occurred: ", err);
//   }
// };

// get by Id
exports.getSignleLead = async (req, res) => {
  try {
    const lead = await Leads.findById(req.params.id);
    res.json(lead);
  } catch (err) {
    res.send("Error " + err);
  }
};

exports.updateLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const updateFields = req.body;

    const updatedLead = await Leads.findByIdAndUpdate(leadId, updateFields, {
      new: true,
    });

    if (!updatedLead) {
      return res
        .status(404)
        .json({ message: "lead with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedLead,
      msg: "lead updated successfully",
    });
  } catch (err) {
    console.log("error in catch block ===>", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const lead = await Leads.findByIdAndDelete(leadId);

    if (!lead) {
      return res.status(404).json({ message: "lead not found" });
    }

    res.json({
      success: true,
      message: "lead deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting lead");
  }
};
