require("dotenv").config();
const User = require("../models/UserSchema");
const express = require("express");
const router = express.Router();

router.put("/edit", async (req, res) => {
  const { username, email, dob} = req.body;

  let user = await User.findOne({ email });

  user.username = username;
  user.email = email;
  user.dob = dob;

  const savedUser = await user.save();
  if (savedUser) {
    res.status(200).json({ msg: "user successfully saved", savedUser });
  } else {
    res.status(400).json({ msg: "Unable to save Altered User" });
  }
});

module.exports = router;
