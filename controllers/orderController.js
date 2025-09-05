const Product = require("../models/Product");
const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
  const { items: cartItems, shippingFee, tax } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No items found in your cart!");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No item found with id: ${item.product}`
      );
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }

  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "inr",
  });

  const order = await Order.create({
    shippingFee,
    tax,
    total,
    subtotal,
    clientSecret: paymentIntent.client_secret,
    orderItems,
    user: req.user.userID,
  });
  res
    .status(StatusCodes.CREATED)
    .send({ order, clientSecret: order.clientSecret });
};
const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with ${id}`);
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userID });

  if (!orders) {
    throw new CustomError.NotFoundError(
      `No orders found related to user ${req.user.userID}`
    );
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { id } = req.params;

  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: id });

  checkPermissions(req.user, order.user);

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with ${id}`);
  }

  //   if(status) {
  //     throw new CustomError.BadRequestError("Please fill all the required fields")
  //   }

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();
  res.status(StatusCodes.OK).json({ msg: "order updated successfully", order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  getCurrentUserOrders,
  updateOrder,
};
