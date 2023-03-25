const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

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
const imageFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    if (imageExtensions.some(e => e == ext)) cb(null, true);
    else cb(null, false);
};

const uploadAvatar = multer({ storage: setUpStoragePath(process.env.AVATAR_USER_STORAGE_PATH), fileFilter: imageFilter })
const uploadArticle = multer({ storage: setUpStoragePath(process.env.ARTICLE_IMAGES_STORAGE_PATH), fileFilter: imageFilter })
const uploadLogo = multer({ storage: setUpStoragePath(process.env.LOGO_IMAGES_STORAGE_PATH), fileFilter: imageFilter })
module.exports = { uploadAvatar, uploadLogo, uploadArticle };