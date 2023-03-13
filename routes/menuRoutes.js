const express = require('express');
const menuController = require('../controllers/menuController');
const { uploadLogo } = require("../services/uploadImageService");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', menuController.getMenu);
router.get('/:link', menuController.getMenuByLink);
router.post('/', menuController.getArticlesByMenuLink);
router.post('/update', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.updateMenu);
router.post('/add', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.addMenu);
router.post('/order-by', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.orderByMenu);
router.post("/upload-logo", authMiddleware.authenticateRequest, uploadLogo.single('logo'), function (req, res) { res.json("upload") });

module.exports = router;
