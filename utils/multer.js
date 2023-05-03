const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,'/upload')
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString()+"-"+ file.originalname)
//     }
// })

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
