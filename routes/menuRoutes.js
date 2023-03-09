const express = require('express');
const menuController = require('../controllers/menuController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', menuController.getMenu);
router.post('/update', menuController.updateMenu);
router.post('/add', menuController.addMenu);

module.exports = router;
