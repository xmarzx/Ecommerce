const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const heroImageController = require("../controllers/heroImageController");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage }).single("image");

router.get("/hero-images/get", heroImageController.getHeroImages);
router.post("/hero-images/post", upload, heroImageController.uploadHeroImage);

module.exports = router;
