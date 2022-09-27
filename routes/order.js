require("dotenv").config();
const Order = require("../models/OrderSchema");
const express = require("express");
const router = express.Router();

router.post("/new", async (req, res) => {
  const { product_id } = req.body;

  const owner_id = req.user.id;

  const newOrder = new Order({
    product_id,
    owner_id,
  });

  const savedProduct = await newOrder.save();

  if (savedProduct) {
    res.status(200).json({ Status: "Saved successfully", savedProduct });
  } else {
    res.status(400).json({ err: "Unable to add new product" });
  }
});

module.exports = router;
