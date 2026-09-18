const express = require("express");
const adminAuth = require("../middlewares/adminAuth");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.use(adminAuth);
router.get("/", categoryController.listCategories);
router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
