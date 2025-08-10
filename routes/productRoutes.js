const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  getSingleProduct,
  uploadImage,
} = require("../controllers/ProductController");
const { authenticateUser } = require("../middleware/authentication");
const { checkPermissions } = require("../utils");

router.post("/", authenticateUser, checkPermissions, createProduct);
router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getSingleProduct);
router.patch("/:id", authenticateUser, checkPermissions, updateProduct);
router.delete("/:id", authenticateUser, checkPermissions, deleteProduct);
router.post("/uploadImage", authenticateUser, checkPermissions, uploadImage);

module.exports = router;
