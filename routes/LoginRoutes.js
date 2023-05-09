require("dotenv").config();
const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");

//S3
const AWS = require("aws-sdk");
const s3 = new AWS.S3();


const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

router.post("/register", async (req, res) => {
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

        const {
            username,
            email,
            password,
            gender,
            dob,
            aboutme,
            contactPhone,
            addressArea,
            addressCity,
        } = fields;

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ msg: "User already exists" });

        const newUser = new User({
            username,
            email,
            password,
            gender,
            dob,
            aboutme,
            contactPhone,
            addressArea,
            addressCity,
        });
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                return res.status(400).json({ err });
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(400).json({ err: err });
                }
                newUser.password = hash;

                if (file.photo) {
                    const imagePath = file.photo.filepath;
                    const blob = fs.readFileSync(imagePath); //converts file into buffer

                    const uploadedImage = await s3
                        .upload({
                            Bucket: process.env.AWS_BUCKET,
                            Key:
                                "ProfilePic" +
                                "-" +
                                Date.now() +
                                file.photo.originalFilename,
                            Body: blob,
                        })
                        .promise();

                    newUser.photo.name = uploadedImage.Key;
                }
                let user = await newUser.save();
                
                if (user) {
                    const id = user._id;
                    const username = user.username;
                    const token = JWT.sign({ id, username }, VALIDATION_TOKEN, {
                        expiresIn: 360000,
                    });
            
                    res.status(200).json({ user, token });
                } else {
                    res.status(400).json({ msg: "unable to save the user" });
                }
            });
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
        const token = JWT.sign({ id, username }, VALIDATION_TOKEN, {
            expiresIn: 360000,
        });

        res.status(200).json({ user, token });
    } else {
        res.status(400).json({ msg: "invalid credentials" });
    }
});

router.get("/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
