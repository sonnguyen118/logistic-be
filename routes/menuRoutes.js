const express = require('express');
const menuController = require('../controllers/menuController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', menuController.getMenu);
router.get('/:link', menuController.getMenuByLink);
router.post('/', menuController.getArticlesByMenuLink);
router.post('/update', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.updateMenu);
router.post('/add', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.addMenu);
router.post('/order-by', authMiddleware.authenticateRequest, authMiddleware.authorize, menuController.orderByMenu);

module.exports = router;
