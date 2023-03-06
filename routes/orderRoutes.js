const express = require('express');
const orderController = require('../controllers/orderController');
const multer = require('multer');
const router = express.Router();
const upload = multer();



router.get('/', orderController.getAllOrder);
router.get('/update', orderController.updateOrder);
router.get('/search/:id', orderController.findOrderById);
router.post('/upload', upload.single('file'), orderController.uploadOrdersFromExcelFile);
router.get('/status', orderController.getAllOrderStatus);

module.exports = router;