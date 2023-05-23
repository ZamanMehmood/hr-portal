const Article = require("../models/knowledgebase.article.model");
// create lead
exports.createArticle = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    // create a new record in db
    const article = new Article(req.body);
    await article.save();
    return res.json({
      success: true,
      data: article,
      msg: "article added sunccessfully",
    });
  } catch (err) {
    console.log("Error handling ===>", err);
    next();
  }
};

// exports.listArticle = async (req, res) => {
//   try {
//     const articles = await Article.find();
//     res.json(articles);
//   } catch (err) {
//     res.send("Error occurred: ", err);
//   }
// };

exports.listArticle = async (req, res, next) => {
  try {
    let { page, pageLimit } = req.query; // we will destruct  parameters that we are sending from front end throgh api

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    pageLimit =
      pageLimit !== undefined && pageLimit !== "" ? parseInt(pageLimit) : 10;

    const total = await Article.countDocuments(); // countDocument will count our documents from Product (Product.countDocuments),or we can say it will count our document in mongodb
    let pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: pageLimit * (page - 1) },
      { $limit: pageLimit },
    ];
    const articles = await Article.aggregate(pipeline); // aggregate works like find , we use aggregate to write advanced queries, aggregate recieve the array as the firs argument which is (pipeline array)
    if (articles) {
      res.status(200).send({
        success: true,
        message: "articles Fetched Successfully",
        data: articles,
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

exports.updateArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const updateFields = req.body;

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedArticle) {
      return res
        .status(404)
        .json({ message: "article with the Given id not found" });
    }

    return res.json({
      success: true,
      data: updatedArticle,
      msg: "article updated successfully",
    });
  } catch (err) {
    console.log("error in catch block ===>", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByIdAndDelete(articleId);

    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }

    res.json({
      success: true,
      message: "article deleted successfully",
    });
  } catch (err) {
    res.status(500).send("Error deleting article");
  }
};
