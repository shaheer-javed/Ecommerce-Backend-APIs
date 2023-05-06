const Product = require("../models/ProductSchema");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const fs = require("fs");
const formidable = require("formidable");
require("dotenv").config();

//cloudinary
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const { bufferToDataURI } = require("../utils/dataURI");

// View all products
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

// View all products of a specific user
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

// Get 1 product
router.get("/:id", async (req, res) => {
    const _id = req.params.id;
    const product = await Product.findOne({ _id });
    if (product == "") {
        res.status(200).json({ Note: "No product to show" });
    } else if (product) {
        res.status(200).json({ product });
    } else {
        res.status(400).json({ err: "Unable to get product" });
    }
});

//delete Product by owner
router.delete("/delete/:id", checkAuth, async (req, res) => {
    const _id = req.params.id;
    const owner = req.user.username;
    const product = await Product.findOne({ _id });
    if (product.owner == owner) {
        Product.deleteOne({ _id })
            .then(() => {
                res.status(200).json({ Note: "Deleted Successfully" });
            })
            .catch((err) => {
                res.status(400).json({ err: "Unable to delete product", err });
            });
    }  else {
        res.status(400).json({ err: "Product does not belongs to you" });
    }
});

// Add a new product
router.post("/new", checkAuth, async (req, res) => {
    const owner = req.user.username;
    const owner_id = req.user.id;
    const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
    });

    // Parsing
    form.parse(req, async (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        const {
            title,
            description,
            price,
            tags,
            quantity,
            estimatedWeight,
            isScrap,
        } = fields;

        const newProduct = new Product({
            title,
            description,
            owner,
            owner_id,
            price,
            tags,
            quantity,
            estimatedWeight,
            isScrap,
        });

        if (file.photo) {
            const urls = [];
            for (const image of file.photo) {
                const fileFormat = image.mimetype.split("/")[1];
                const buff = fs.readFileSync(image.filepath); // convert img into buffer
                const { base64 } = bufferToDataURI(fileFormat, buff);
                const newPath = await cloudinary.uploads(base64, fileFormat);
                urls.push(newPath.url);
            }
            console.log("urls = ", urls);

            newProduct.photo.url = urls;
        }

        newProduct.save((err, result) => {
            if (err) {
                res.status(400).json({ err: "Unable to add new product" });
            } else {
                res.status(200).json({
                    Status: "Saved successfully",
                    result,
                });
            }
        });
    });
});

// Edit a product
// use id from params to get the specific product
// router.put("/edit", checkAuth, async (req, res) => {
router.put("/edit/:id", checkAuth, async (req, res) => {
    const _id = req.params.id;

    const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
    });

    // Parsing
    form.parse(req, async (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        const {
            title,
            description,
            price,
            tags,
            quantity,
            estimatedWeight,
            isScrap,
        } = fields;

        const product = await Product.findOne({ _id });

        product.title = title;
        product.description = description;
        product.price = price;
        product.tags = tags;
        product.quantity = quantity;
        product.estimatedWeight = estimatedWeight;
        product.isScrap = isScrap;

        if (file.photo) {
            const urls = [];
            for (const image of file.photo) {
                const fileFormat = image.mimetype.split("/")[1];
                const buff = fs.readFileSync(image.filepath); // convert img into buffer
                const { base64 } = bufferToDataURI(fileFormat, buff);
                const newPath = await cloudinary.uploads(base64, fileFormat);
                urls.push(newPath.url);
            }
            console.log("urls = ", urls);

            product.photo.url = urls;
        }

        product.save((err, result) => {
            if (err) {
                res.status(400).json({ err: "Unable to edit product" });
            } else {
                res.status(200).json({ Status: "Saved successfully", result });
            }
        });
    });
});

module.exports = router;
