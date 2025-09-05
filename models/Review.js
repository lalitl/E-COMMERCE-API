const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide ratings"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide comment"],
      maxLength: 300,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAvg = async function (productID) {
  const res = await this.aggregate([
    {
      $match: {
        product: productID,
      },
    },
    {
      $group: {
        _id: null,
        averageRatings: {
          $avg: "$rating",
        },
        numOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productID },
      {
        averageRatings: Math.ceil(res[0]?.averageRatings) || 0,
        numOfReviews: res[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log("Error in aggregate function - Review model", error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAvg(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAvg(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
