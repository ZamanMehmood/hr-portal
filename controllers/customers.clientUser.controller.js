const User = require("../models/customers.clientUser.model");

// create client
exports.clientUser = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);

    // create a new record in db
    const user = new User(req.body);
    await user.save();
    return res.json({
      success: true,
      data: user,
      msg: "user addded sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// get all clients
// exports.listClientUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.send("Error occur ===>", err);
//   }
// };

exports.listClientUsers = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await User.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const users = await User.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (users) {
      res.status(200).send({
        success: true,
        message: "users Fetched Successfully",
        data: users,
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
      msg: "users fetched successfully",
    });
  }
};
// get by Id
exports.getSingalClientUser = async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    res.json(users);
  } catch (err) {
    res.send("Error " + err);
  }
};

//edit client
exports.updateClientUser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const user = await User.findById(req.params.id);
    user.companyName = req.body.companyName;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.emailAddress = req.body.emailAddress;
    user.telephone = req.body.telephone;
    user.position = req.body.position;

    const updatedClientUser = await user.save();
    return res.json({
      success: true,
      data: updatedClientUser,
      msg: "User updated successfully!",
    });
  } catch (err) {
    return res.json({
      success: false,
      data: User,
      msg: "User not Updated Successfully",
    });
  }
};

// delete client by id
exports.deleteClientUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }
    return res.json({
      success: true,
      data: deletedUser,
      msg: "User deleted successfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};
