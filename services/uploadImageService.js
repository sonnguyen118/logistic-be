const multer = require('multer');

// var uploadImages = {}

var avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatar/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const uploadImages = multer({ storage: avatarStorage })

module.exports = uploadImages;