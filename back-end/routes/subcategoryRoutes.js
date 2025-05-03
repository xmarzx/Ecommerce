const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/subcategoryController");

router.get(
  "/subcategories/by-category",
  subcategoryController.getSubcategoriesByCategory
);
router.get("/subcategories", subcategoryController.getAllSubcategories);

module.exports = router;
