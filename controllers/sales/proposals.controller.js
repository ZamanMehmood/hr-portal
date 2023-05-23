const Proposal = require("../../models/sales/proposals.model");

// create proposal
exports.addProposal = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const proposal = new Proposal(req.body);
    await proposal.save();
    return res.json({
      success: true,
      data: proposal,
      msg: "proposal added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// list proposals
exports.listProposals = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Proposal.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const proposals = await Proposal.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (proposals) {
      res.status(200).send({
        success: true,
        message: "proposals Fetched Successfully",
        data: proposals,
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
// view proposals
exports.viewProposal = async (req, res) => {
  try {
    const proposals = await Proposal.findById(req.params.id);
    res.json(proposals);
  } catch (err) {
    res.send("Error " + err);
  }
};
// edit proposal
exports.editProposal = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const updateFields = req.body;

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedProposal) {
      return res
        .status(404)
        .json({ message: "proposal with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedProposal,
      msg: "proposal updated successfully",
    });
  } catch (err) {
    console.log("Err ---->", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a proposal by ID
exports.deleteProposal = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const proposal = await Proposal.findByIdAndDelete(proposalId);

    if (!proposal) {
      return res.status(404).json({ message: "proposal not found" });
    }
    res.json({
      success: true,
      message: "proposal deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting proposal");
  }
};
