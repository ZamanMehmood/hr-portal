const Client = require("../models/cutomers.client.model");

// create client
exports.Clients = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);

    // create a new record in db
    const client = new Client(req.body);
    await client.save();
    return res.json({
      success: true,
      data: client,
      msg: "Client add sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// get all clients
exports.listClients = async (req, res) => {
  try {
    let { page, pageLimit } = req.query;
    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Client.countDocuments();
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];

    const clients = await Client.aggregate(pipeline);
    if (clients) {
      res.status(200).send({
        success: true,
        msg: "clinets fetched successfully",
        data: clients,
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
      res.status(400).send({ success: false, msg: "Client not fetched" });
    }
    // res.json(clients);
  } catch (err) {
    // res.send("Error occur ===>", err);
    return res.json({
      success: false,
      msg: "clients not fethced",
    });
  }
};

// get by Id
exports.getSingalClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    res.json(client);
  } catch (err) {
    res.send("Error " + err);
  }
};

//edit client
// exports.updateClient = async (req, res) => {
//   try {
//     console.log("req.body", req.body);
//     const client = await Client.findById(req.params.id);
//     client.companyName = req.body.companyName;
//     client.firstName = req.body.firstName;
//     client.lastName = req.body.lastName;
//     client.emailAddress = req.body.emailAddress;
//     client.category = req.body.category;
//     client.descriptionDetails = req.body.descriptionDetails;
//     client.billingAddress = req.body.billingAddress;
//     client.shippingAddress = req.body.shippingAddress;
//     client.appModules = req.body.appModules;
//     client.moreInformation = req.body.moreInformation;

//     const updatedClient = await client.save();
//     res.json(updatedClient);
//   } catch (err) {
//     return res.json({
//       success: false,
//       data: Client,
//       msg: "Client not Updated Successfully",
//     });
//   }
// };

// edit client
exports.updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const updateFields = req.body;

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedClient) {
      return res
        .status(404)
        .json({ message: "client with the Given id was not found" });
    }

    return res.json({
      success: true,
      data: updatedClient,
      msg: "client updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete client by id
exports.deleteClient = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    const deletedClient = await Client.findByIdAndDelete(clientId);
    if (!deletedClient) {
      return res.json({
        success: false,
        msg: "Client not found",
      });
    }
    return res.json({
      success: true,
      data: deletedClient,
      msg: "Client deleted successfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};
