const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer();



router.get('/', authMiddleware.authenticateRequest, orderController.getAllOrder);
router.get('/update', authMiddleware.authenticateRequest, orderController.updateOrder);
router.get('/search/:id', authMiddleware.authenticateRequest, orderController.findOrderById);
router.post('/upload', authMiddleware.authenticateRequest, upload.single('file'), orderController.uploadOrdersFromExcelFile);
router.get('/status', authMiddleware.authenticateRequest, orderController.getAllOrderStatus);

module.exports = router;