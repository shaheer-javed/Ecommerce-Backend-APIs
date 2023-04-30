const Product = require("../models/ProductSchema");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const fs = require("fs");
const formidable = require("formidable");
require("dotenv").config();

//S3
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

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

        /*
        if (file.photo) {
            // console.log(file.photo);
            const fileFormat = file.photo.mimetype.split("/")[1];
            newProduct.photo.contentType = fileFormat;
            // const buffer = fs.readFileSync(file.photo.filepath)
            // const { base64 } = bufferToDataURI(fileFormat, file.photo.path);
            // newProduct.photo.data = fs.readFileSync(file.photo.filepath);
            // newProduct.photo.data = fs.readFileSync(base64);
            // newProduct.photo.contentType = file.photo.mimetype;
            let imageString = fs.readFileSync(file.photo.filepath);;
            let encodeImage = imageString.toString("base64");
            let bufferImage = Buffer.from(encodeImage, "base64");
            newProduct.photo.data = bufferImage;
        }  */

        if (file.photo != NULL) {
            const imagePath = file.photo.filepath;
            const blob = fs.readFileSync(imagePath);

            const uploadedImage = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET,
                    Key: owner_id + Date.now()+file.photo.originalFilename ,
                    Body: blob,
                })
                .promise();

            newProduct.photo.name = uploadedImage.Key;

            console.log("image:::::::", uploadedImage);
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

module.exports = router;
