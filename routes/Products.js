// const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allProducts = await Product.find();

  if (allProducts == "") {
    res.status(200).json({ Note: "No products to show" });
  } else if (allProducts ) {
    res.status(200).json({ allProducts });
  } else {
    res.status(400).json({ err: "Unable to get products" });
  }
});

router.post("/new", async (req, res) => {
  const { title, description, price, tags, isScrap } = req.body;

  let owner = req.user;

  console.log(req.user);

  const newProduct = new Product({
    title,
    description,
    owner,
    price,
    tags,
    isScrap,
  });

  const savedProduct = await newProduct.save();

  if (savedProduct) {
    res.status(200).json({ Status: "Saved successfully", savedProduct });
  } else {
    res.status(400).json({ err: "Unable to add new product" });
  }
});

module.exports = router;
