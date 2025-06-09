// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

// router.get('/profile', authenticateToken, (req, res) => {
//   // req.user contendrá la información del usuario del token
//   res.json({ message: 'Acceso al perfil concedido', user: req.user });
// });

module.exports = router;
