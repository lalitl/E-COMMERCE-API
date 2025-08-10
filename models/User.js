const mongoose = require("mongoose");
const validator = require("validator");
const bcrpyt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrpyt.genSalt(10);
  const hashedPassword = await bcrpyt.hash(this.password, salt);
  this.password = hashedPassword;
});

UserSchema.methods.compare = async function (candidatePassword) {
  const isMatch = await bcrpyt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
