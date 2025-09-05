const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");

router.get("/", getAllReviews);
router.get("/:id", getSingleReview);
router.post("/", authenticateUser, createReview);
router.patch("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;
