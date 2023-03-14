const express = require("express");
const managerController = require("../controllers/managerController");
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadLogo } = require("../services/uploadImageService");

const router = express.Router();

router.post("/upload-logo", authMiddleware.authenticateRequest, authMiddleware.authorize, uploadLogo.single('logo'), function (req, res) { res.json("upload") });
router.post("/update", authMiddleware.authenticateRequest, authMiddleware.authorize, managerController.updateText);
router.post("/add", authMiddleware.authenticateRequest, authMiddleware.authorize, managerController.addText);
router.post("/", managerController.getTextByName);

module.exports = router;
