const User = require("../models/UserSchema");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const formidable = require("formidable");
const checkAuth = require("../middlewares/checkAuth");
require("dotenv").config();

//S3
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

//get function to show user info in the form while editing
router.get("/info", checkAuth, async (req, res) => {
    // const _id = req.params.id;
    const _id = req.user.id;
    let user = await User.findOne({ _id });
    let profilePic;
    if (user.photo.name ) {
        profilePic = await s3
            .getObject({
                Bucket: process.env.AWS_BUCKET,
                Key: user.photo.name,
            })
            .promise();
    } else {
        profilePic = "";
    }
    if (user) {
        res.status(200).json({ user, profilePic });
    } else {
        res.status(400).json({ msg: "Unable to get user info" });
    }
});

//edit user profile
router.put("/edit", checkAuth, async (req, res) => {
    const _id = req.params.id;
    const owner_id = req.user.id;

    const form = new formidable.IncomingForm({
        multiples: true,
        keepExtensions: true,
    });

    // Parsing
    form.parse(req, async (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: err,
            });
        }

        const { name, dob, aboutMe, contactPhone, address } = fields;

        let user = await User.findOne({ _id });

        user.name = name;
        user.dob = dob;
        user.aboutMe = aboutMe;
        user.contactPhone = contactPhone;
        user.address = address;

        if (file.photo) {
            const imagePath = file.photo.filepath;
            const blob = fs.readFileSync(imagePath); //converts file into buffer

            const uploadedImage = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET,
                    Key:
                        "ProfilePic" +
                        " " +
                        owner_id +
                        Date.now() +
                        file.photo.originalFilename,
                    Body: blob,
                })
                .promise();

            user.photo.name = uploadedImage.Key;
        }

        user.save((err, result) => {
            if (err) {
                res.status(400).json({ msg: "Unable to save Altered User" });
            } else {
                res.status(200).json({
                    msg: "user successfully saved",
                    result,
                });
            }
        });
    });
});

//function to show owner info in the product page
router.get("/owner-info/:id", async (req, res) => {
    // const _id = req.body.owner_id;
    const _id = req.params.id;
    let user = await User.findOne({ _id });
    let profilePic;
    if (user.photo) {
        profilePic = await s3
            .getObject({
                Bucket: process.env.AWS_BUCKET,
                Key: user.photo.name,
            })
            .promise();
    } else {
        profilePic = "";
    }
    if (user) {
        res.status(200).json({
            "username": user.username,
            "addressArea": user.addressArea,
            "addressCity": user.addressCity,
            "contactPhone": user.contactPhone,
            profilePic,
        });
    } else {
        res.status(400).json({ msg: "Unable to get user info" });
    }
});

module.exports = router;
