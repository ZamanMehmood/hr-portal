const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sales/expenses.controller");
// const { cpUpload } = require("../../utils/upload");

//
const multer = require("multer"); // we use for uploading image
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.post("/addExpense", upload.single("Image"), controller.addExpense); // images is the directory from where i am uploading images
// router.post("/addExpense", cpUpload, controller.addPayment);
router.get("/listExpenses", controller.listExpenses);
router.get("/:id", controller.viewExpense);
router.put("/:id", upload.single("Image"), controller.editExpense);
router.delete("/:id", controller.deleteExpense);

module.exports = router;
