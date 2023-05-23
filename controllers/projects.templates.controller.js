const Template = require("../models/projects.templete.model");

// create template
exports.addTemplate = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);

    // create a new record in db
    const template = new Template(req.body);
    await template.save();
    return res.json({
      success: true,
      data: template,
      msg: "template addded sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// get all templates
exports.listTemplates = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Template.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const templates = await Template.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (templates) {
      res.status(200).send({
        success: true,
        message: "templates Fetched Successfully",
        data: templates,
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

// get template by Id
exports.getSignleTemplate = async (req, res) => {
  try {
    const templates = await Template.findById(req.params.id);
    res.json(templates);
  } catch (err) {
    res.send("Error " + err);
  }
};

// edit template
exports.updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const updateFields = req.body;

    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId,
      updateFields,
      { new: true }
    );

    if (!updatedTemplate) {
      return res
        .status(404)
        .json({ message: "Project with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedTemplate,
      msg: "Project updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// delete template by id
exports.deleteTemplate = async (req, res, next) => {
  try {
    const templateId = req.params.id;
    const deletedTemplate = await Template.findByIdAndDelete(templateId);
    if (!deletedTemplate) {
      return res.json({
        success: false,
        msg: "Template not found",
      });
    }
    return res.json({
      success: true,
      msg: "Template deleted successfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};
