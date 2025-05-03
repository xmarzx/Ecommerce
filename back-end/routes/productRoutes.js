const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/latest-products", productController.getLatestProducts);
router.get("/best-sellers", productController.getBestSellers);
router.get("/products", productController.getAllProducts);
router.get("/products/:productId", productController.getProductById);
router.get(
  "/products/related/:productId",
  productController.getRelatedProducts
);

module.exports = router;
