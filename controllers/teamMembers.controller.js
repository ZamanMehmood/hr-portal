// const Project = require("../models/projects.model");
const Team = require("../models/teamMembers.model");
// add team member
exports.addTeamMember = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const team = new Team(req.body);
    await team.save();
    return res.json({
      success: true,
      data: team,
      msg: "team member add successfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

exports.listTeamMembers = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Team.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const team = await Team.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (team) {
      res.status(200).send({
        success: true,
        message: "team Fetched Successfully",
        data: team,
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

exports.updateMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const updateFields = req.body;

    const updateMember = await Team.findByIdAndUpdate(memberId, updateFields, {
      new: true,
    });

    if (!updateMember) {
      return res
        .status(404)
        .json({ message: "Team Member with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updateMember,
      msg: "Team Member updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a project by ID
exports.deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await Team.findByIdAndDelete(memberId);

    if (!member) {
      return res.status(404).json({ message: "member not found" });
    }

    res.json({
      success: true,
      message: "member deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting member");
  }
};
