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
const { getSingleProductReviews } = require("../controllers/reviewController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  createProduct
);
router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getSingleProduct);
router.get("/:id/reviews", getSingleProductReviews);
router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateProduct
);
router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  deleteProduct
);
router.post(
  "/uploadImage",
  authenticateUser,
  authorizePermissions("admin"),
  uploadImage
);

module.exports = router;
