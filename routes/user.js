const User = require("../models/UserSchema");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const formidable = require("formidable");
require("dotenv").config();

//S3
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

//get function to show user info in the form while editing
router.get("/info", async (req, res) => {
    // const id = req.user.id;
    const username = req.user.username;
    let user = await User.findOne({ username });
    console.log(user);
    let profilePic;
    if (user.photo.name) {
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
router.put("/edit", async (req, res) => {
    const person = req.user.username;
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

        const { name, dob, gender, aboutMe, contactPhone, contactEmail } =
            fields;

        let user = await User.findOne({ person });

        user.name = name;
        user.dob = dob;
        user.gender = gender;
        user.aboutMe = aboutMe;
        user.contactPhone = contactPhone;
        user.contactEmail = contactEmail;

        if (file.photo) {
            const imagePath = file.photo.filepath;
            const blob = fs.readFileSync(imagePath);

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
            // console.log("image:::::::", uploadedImage);
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

module.exports = router;
