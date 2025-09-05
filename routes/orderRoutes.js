const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} = require("../controllers/orderController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.get("/", authenticateUser, authorizePermissions("admin"), getAllOrders);
router.post("/", authenticateUser, createOrder);
router.get("/showAllMyOrders", authenticateUser, getCurrentUserOrders);

router.get("/:id", authenticateUser, getSingleOrder);
router.patch("/:id", authenticateUser, updateOrder);

module.exports = router;
