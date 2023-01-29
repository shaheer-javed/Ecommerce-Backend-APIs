require("dotenv").config();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");

const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) return res.status(400).json({ msg: "User already exists" });

  const newUser = new User({ username, email, password });

  //hashing password
  bcrypt.genSalt(8, (err, salt) => {
    if (err) {
      return res.status(400).json({ err });
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(400).json({ err: err });
      }
      newUser.password = hash;
      const savedUser = await newUser.save();
      if (savedUser) {
        const id = newUser._id;

        const token = await JWT.sign({ id, username }, VALIDATION_TOKEN, {
          expiresIn: 360000,
        });

        res.status(200).json({ savedUser, token });
      }
    });
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (matchPassword) {
    const id = user._id;
    const username = user.username;
    const token = await JWT.sign({ id, username }, VALIDATION_TOKEN, {
      expiresIn: 360000,
    });

    res.status(200).json({ user, token });
    // return res.status(400).json({ msg: "You have logged in successfully" });
  } else {
    return res.status(400).json({ msg: "invalid credentials" });
  }
});

router.get('/logout', (req, res) => {
  localStorage.removeItem("artsy-jwt");
   res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
