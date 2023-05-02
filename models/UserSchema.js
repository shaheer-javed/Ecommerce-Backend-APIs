const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    aboutMe: {
      type: String,
      required: false,
    },
    contactEmail: {
      type: String,
      required: false,
    },
    contactPhone: {
      type: String,
      required: false,
    },
    photo: {
      name: String,
      required: false,
  },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
