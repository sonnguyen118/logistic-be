const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

logo = process.env.LOGO_STORAGE_PATH
avatar = process.env.AVATAR_USER_STORAGE_PATH
article = process.env.ARTICLE_IMAGES_STORAGE_PATH

// var avatarStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/avatar/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

function setUpStoragePath(path) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
}

const uploadAvatar = multer({ storage: setUpStoragePath(process.env.AVATAR_USER_STORAGE_PATH) })
const uploadLogo = multer({ storage: setUpStoragePath(process.env.LOGO_STORAGE_PATH) })
const uploadArticle = multer({ storage: setUpStoragePath(process.env.ARTICLE_IMAGES_STORAGE_PATH) })

module.exports = { uploadAvatar, uploadLogo, uploadArticle };