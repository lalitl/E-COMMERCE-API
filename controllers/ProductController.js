const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userID;
  const product = await Product.create(req.body);
  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID }).populate("reviews");

  if (!product) {
    throw new CustomError.NotFoundError("Product does not exists!");
  }
  return res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!productID) {
    throw new CustomError.NotFoundError("Product does not exists!");
  }

  return res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productID } = req.params;
  const product = await Product.findOne({ _id: productID });
  if (!product) {
    throw new CustomError.NotFoundError("Product does not exists!");
  }

  await product.remove();
  return res.status(StatusCodes.OK).send("Product deleted successfully!");
};

const uploadImage = async (req, res) => {
  console.log(req.files);

  if (!req.files) {
    throw new CustomError.BadRequestError("No File Exists!");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const imageMaxSize = 1024 * 1024;

  if (productImage.size > imageMaxSize) {
    throw new CustomError.BadRequestError("Please Upload a Image smaller 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    `${productImage.name}`
  );

  productImage.mv(imagePath);

  return res.status(StatusCodes.OK).json({
    image: `/uploads/${productImage.name}`,
    msg: "Image uploaded successfully!",
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
