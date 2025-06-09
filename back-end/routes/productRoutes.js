const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../temp_uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage }).single("image");

router.get("/latest-products", productController.getLatestProducts);
router.get("/best-sellers", productController.getBestSellers);
router.get("/products", productController.getAllProducts);
router.get("/products/:productId", productController.getProductById);
router.get(
  "/products/related/:productId",
  productController.getRelatedProducts
);
router.get("/sizes/:idSubcategory", productController.getSizesForSubcategory);

router.post(
  "/products",
  authenticateToken,
  authorizeRoles("admin"),
  upload,
  productController.addProduct
);

module.exports = router;
