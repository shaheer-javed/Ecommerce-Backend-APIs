const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb({messge: 'Unsupported file format'}, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload;
