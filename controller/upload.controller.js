// const { UploadStream } = require("cloudinary");
// const { uploadToCloudinary } = require("../service/upload.service");
// const { bufferToDataURI } = require("../utils/file");

const express = require("express");

const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

// const uploadImage = async (req, res, next) => {

router.post("/", upload.array("image"), async (req, res) => {
    console.log(req);
    const { files } = req;
    // if (!files) throw 'Image is required'
    // console.log("photo from /upload",file)

    // const fileFormat = file.mimetype.split('/')[1]
    // const { base64 } = bufferToDataURI(fileFormat, file.buffer)

    // const imageDetails = await uploadToCloudinary(base64, fileFormat)

    const uploader = async (path) => await cloudinary.uploads(path, "Images");

    const urls = [];
    console.log("files =",files);
    for (const file of files) {
       console.log("file =",file);
        const path  = file.filepath;
        console.log("path =",path);
        const newPath = await uploader(path);
        urls.push(newPath);
    }

    res.json({
        status: "success",
        message: "Upload successful",
        data: urls,
    });
});

// module.exports = {
//   uploadImage,
// }

module.exports = router;
