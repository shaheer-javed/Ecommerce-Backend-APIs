const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
    contactInfo: {
      type: String,
      required: false,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
