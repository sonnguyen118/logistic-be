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
router.get('/:id/toggle-enabled', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.toggleEnabledMenu);

module.exports = router;
