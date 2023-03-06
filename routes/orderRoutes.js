const express = require('express');
const orderController = require('../controllers/orderController');
const multer = require('multer');
const router = express.Router();
const upload = multer();



router.get('/', orderController.getAll);
router.get('/update', orderController.updateOrder);
router.get('/search/:code', orderController.findOrderByOrderCode);
router.post('/upload', upload.single('file'), orderController.uploadOrdersFromExcelFile);

module.exports = router;