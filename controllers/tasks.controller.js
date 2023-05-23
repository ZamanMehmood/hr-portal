const Tasks = require("../models/tasks.model");

// create task
exports.createTask = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const task = new Tasks(req.body);
    await task.save();
    return res.json({
      success: true,
      data: task,
      msg: "task added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

exports.listTask = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Tasks.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const tasks = await Tasks.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (tasks) {
      res.status(200).send({
        success: true,
        message: "tasks Fetched Successfully",
        data: tasks,
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

exports.getSingleTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    res.json(task);
  } catch (err) {
    res.send("Error " + err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateFields = req.body;

    const updatedTask = await Tasks.findByIdAndUpdate(taskId, updateFields, {
      new: true,
    });

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "task with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedTask,
      msg: "task updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Tasks.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    res.json({
      success: true,
      message: "task deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting task");
  }
};
