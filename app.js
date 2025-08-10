require("dotenv").config();
require("express-async-errors");

// express app
const express = require("express");
const app = express();

// DB connection
const connectDB = require("./db/connect");

// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("e-commerce-api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`successfully connected to port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
