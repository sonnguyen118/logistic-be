const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();
const upload = multer();



router.get('/', authMiddleware.authenticateRequest, orderController.getAllOrder);
router.post('/update', authMiddleware.authenticateRequest, authMiddleware.authorize, orderController.updateOrder);
router.get('/search/:id', authMiddleware.authenticateRequest, orderController.findOrderById);
router.post('/upload', authMiddleware.authenticateRequest, authMiddleware.authorize, upload.single('file'), orderController.uploadOrdersFromExcelFile);
router.get('/status', authMiddleware.authenticateRequest, orderController.getAllOrderStatus);
router.post('/search', authMiddleware.authenticateRequest, orderController.filterOrder);
router.post('/remove', authMiddleware.authenticateRequest, authMiddleware.authorize, orderController.softDelete);

module.exports = router;