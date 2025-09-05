const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productID } = req.body;

  const isValidProduct = await Product.findOne({ _id: productID });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError("Product does not exists!");
  }

  const alreadySubmitted = await Review.findOne({
    product: productID,
    user: req.user.userID,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError("Review already exists!");
  }
  req.body.user = req.user.userID;
  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError("Review does not exists!");
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewID } = req.params;
  const { rating, title, comment } = req.body;
  if (!rating || !title || !comment) {
    throw new CustomError.BadRequestError(
      "Please enter all the required fields"
    );
  }
  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new CustomError.NotFoundError("Review does not exists!");
  }

  checkPermissions(req.user, review.user);
  review.title = title;
  review.rating = rating;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewID } = req.params;

  const review = await Review.findOne({ _id: reviewID });

  if (!review) {
    throw new CustomError.NotFoundError("Review does not exists!");
  }

  checkPermissions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).send("Review deleted successfully!");
};

const getSingleProductReviews = async (req, res) => {
  const { id: productID } = req.params;
  const reviews = await Review.find({ product: productID });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
