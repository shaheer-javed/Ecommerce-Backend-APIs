require("dotenv").config();
const User = require("../models/UserSchema");
const express = require("express");
const router = express.Router();

//edit user profile
router.put("/edit", async (req, res) => {
  const { username, email,name, dob, gender, aboutMe, contactInfo} = req.body;

  let user = await User.findOne({ email });

  user.username = username;
  user.email = email;
  user.name = name;
  user.dob = dob;
  user.gender = gender;
  user.aboutMe = aboutMe;
  user.contactInfo = contactInfo;

  const savedUser = await user.save();
  if (savedUser) {
    res.status(200).json({ msg: "user successfully saved", savedUser });
  } else {
    res.status(400).json({ msg: "Unable to save Altered User" });
  }
});

//get function to show user info in the form while editing
router.get("/info", async (req, res) => {
  const user = req.user.username;
  let person = await User.findOne({ user });

  if (person) {
    res.status(200).json({ person });
  } else {
    res.status(400).json({ msg: "Unable to get user info" });
  }
});

module.exports = router;
