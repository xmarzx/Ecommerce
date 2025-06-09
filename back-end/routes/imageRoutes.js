const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const imageController = require("../controllers/imageController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage }).single("image");

router.get("/images/get", imageController.getImages);

router.post(
  "/images/post",
  authenticateToken,
  authorizeRoles("admin"),
  upload,
  imageController.uploadImage
);

module.exports = router;
