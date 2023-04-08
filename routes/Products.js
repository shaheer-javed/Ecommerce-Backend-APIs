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

router.get("/:id", async (req, res)=>{
  const id = req.params.id;
  const product = await Product.findOne({ id });
  if (product == "") {
    res.status(200).json({ Note: "No product to show" });
  } else if (product) {
    res.status(200).json({ product });
  } else {
    res.status(400).json({ err: "Unable to get product" });
  }
})

router.post("/new", async (req, res) => {
  const { description, price, tags } = req.body;
  let title =req.body.title;

  const owner = req.user.username;
  const owner_id = req.user.id;
  
  let isScrap = true;

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


router.get("/myproducts", async (req, res) => {

  const owner = req.user.username;
  const myproducts = await Product.find();
  if (myproducts == "") {
    res.status(200).json({ Note: "No products to show" });
  } else if (myproducts) {
    res.status(200).json({ Status: "got all products", myproducts });
  } else {
    res.status(400).json({ err: "Unable to get products" });
  }
});



module.exports = router;