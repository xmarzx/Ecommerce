const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post("/orders", authenticateToken, orderController.createOrder);

router.get(
  "/orders/user",
  authenticateToken,
  authorizeRoles("admin", "customer"),
  orderController.getUserOrders
);

router.get(
  "/orders/:id",
  authenticateToken,
  authorizeRoles("admin", "customer"),
  orderController.getSingleOrderDetails
);

router.get(
  "/admin/orders",
  authenticateToken,
  authorizeRoles("admin"),
  orderController.getAllOrders
);

router.put(
  "/admin/orders/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  orderController.updateOrderStatus
);

module.exports = router;
