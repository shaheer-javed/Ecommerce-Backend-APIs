const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const { bufferToDataURI } = require("../utils/dataURI");

router.post("/", upload.array("image"), async (req, res) => {
    const { files } = req;

    const urls = [];
    for (const file of files) {
        const fileFormat = file.mimetype.split('/')[1]
        const { base64 } = bufferToDataURI(fileFormat, file.buffer)
        const newPath = await cloudinary.uploads(base64, fileFormat);
        urls.push(newPath.url);
    }

    res.json({
        message: "Upload successful",
        images: urls,
    });
});

module.exports = router;