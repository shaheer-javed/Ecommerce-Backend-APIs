const { uploadToCloudinary } = require("../service/upload.service");
const { bufferToDataURI } = require('../utils/file')

const uploadImage = async (req, res, next) => {
  try {
    console.log(req);
    const { file } = req
    if (!file) throw 'Image is required'
    console.log("photo from /upload",file)

    const fileFormat = file.mimetype.split('/')[1]
    const { base64 } = bufferToDataURI(fileFormat, file.buffer)

    const imageDetails = await uploadToCloudinary(base64, fileFormat)

    res.json({
      status: 'success',
      message: 'Upload successful',
      data: imageDetails,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadImage,
}
