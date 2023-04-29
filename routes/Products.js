// const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

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

router.get("/myproducts", checkAuth, async (req, res) => {
    const owner = req.user.username;
    const myproducts = await Product.find({ owner });
    if (myproducts == "") {
        res.status(200).json({ Note: "No products to show" });
    } else if (myproducts) {
        res.status(200).json({ Status: "got all products", myproducts });
    } else {
        res.status(400).json({ err: "Unable to get products" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({ id });
    if (product == "") {
        res.status(200).json({ Note: "No product to show" });
    } else if (product) {
        res.status(200).json({ product });
    } else {
        res.status(400).json({ err: "Unable to get product" });
    }
});


router.put("/edit", checkAuth, async (req, res) => {
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

router.post("/new", checkAuth, async (req, res) => {
    const owner = req.user.username;
    const owner_id = req.user.id;
    // var img = fs.readFileSync(req.file.path);
    const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
    });

    // form.parse(req);
    // Parsing
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        const { title, description, price, tags, isScrap } = fields;

        // let newProduct = new Product(owner,owner_id,fields);
        const newProduct = new Product({
            title,
            description,
            owner,
            owner_id,
            price,
            tags,
            isScrap,
          });

        if (file.photo) {
            // console.log(file.photo);
            newProduct.photo.data = fs.readFileSync(file.photo.filepath);
            newProduct.photo.contentType = file.photo.mimetype;
        }

        newProduct.save((err,result)=>{
            if(err){
                res.status(400).json({ err: "Unable to add new product" });
             } else {
                res.status(200).json({
                    Status: "Saved successfully",
                    result,
                });
             }
        })
    });
});

module.exports = router;
