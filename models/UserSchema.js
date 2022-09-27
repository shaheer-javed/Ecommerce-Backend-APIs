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
    Name: {
      type: String,
      required: false,
    },
    contact_info: {
      type: String,
      required: false,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
