// const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allProducts = await Product.find();

  if (allProducts == "") {
    res.status(200).json({ Note: "No products to show" });
  } else if (allProducts) {
    res.status(200).json({ allProducts });
  } else {
    res.status(400).json({ err: "Unable to get products" });
  }
});

router.post("/new", async (req, res) => {
  const { title, description, price, tags, isScrap } = req.body;

  const owner = req.user.username;
  const owner_id = req.user.id;

  // console.log(owner)
  // console.log(owner_id)

  // console.log(req.user);

  const newProduct = new Product({
    title,
    description,
    owner,
    owner_id,
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

router.put("/edit", async (req, res) => {
  const { title, description, price, tags, isScrap } = req.body;

  let product = await Product.findOne({ title });

  product.title = title;
  product.description = description;
  product.price = price;
  product.tags = tags;
  product.isScrap = isScrap;

  const savedProduct = await product.save();

  if (savedProduct) {
    res.status(200).json({ Status: "Saved successfully", savedProduct });
  } else {
    res.status(400).json({ err: "Unable to edit product" });
  }
});

module.exports = router;
