const Project = require("../models/projects.model");

// create client
exports.project = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const project = new Project(req.body);
    await project.save();
    return res.json({
      success: true,
      data: project,
      msg: "project add sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// get all projects
// exports.listProjects = async (req, res) => {
//   try {
//     let { page, pageLimit } = req.query;

//     page = page !== undefined && page !== "" ? parseInt(page) : 1;
//     pageLimit =
//       pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

//     const total = await Project.countDocuments(); // this will count my all documents

//     let pipeline = [
//       { $ort: { createdAt: -1 } },
//       { $skip: pageLimit * (page - 1) },
//       { $limit: pageLimit },
//     ];

//     const projects = await Project.aggregate(pipeline);
//     // res.json(projects);
//     if (projects) {
//       res.status(200).send({
//         success: true,
//         message: "projects Fetched Successfully",
//         data: projects,
//         total: total,
//         pagination: {
//           page,
//           pageLimit,
//           total,
//           pages:
//             Math.ceil(total / pageLimit) <= 0
//               ? 1
//               : Math.ceil(total / pageLimit),
//         },
//       });
//     } else {
//       res.status(400).send({ success: false, message: "Data not fetched" });
//     }
//   } catch (err) {
//     return res.json({
//       success: false,
//       msg: "leads not fetched",
//     });
//   }
// };

// exports.listProjects = async (req, res) => {
//   try {
//     console.log("req.query", req.query);
//     const filters = {};

//      if (req.query.client) {
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

exports.listProjects = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Project.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const projects = await Project.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (projects) {
      res.status(200).send({
        success: true,
        message: "projects Fetched Successfully",
        data: projects,
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

exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.send("Error " + err);
  }
};

exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const updateFields = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateFields,
      { new: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ message: "Project with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedProject,
      msg: "Project updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting project");
  }
};
