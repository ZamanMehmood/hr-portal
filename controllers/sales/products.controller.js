const Product = require("../../models/sales/products.model");

// create product
exports.addProduct = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const product = new Product(req.body);
    await product.save();
    return res.json({
      success: true,
      data: product,
      msg: "product added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// list products
exports.listProducts = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Product.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const products = await Product.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (products) {
      res.status(200).send({
        success: true,
        message: "products Fetched Successfully",
        data: products,
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
// view products
exports.viewProduct = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res.json(products);
  } catch (err) {
    res.send("Error " + err);
  }
};
// edit product
exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateFields = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "product with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedProduct,
      msg: "product updated successfully",
    });
  } catch (err) {
    console.log("Err ---->", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
};
