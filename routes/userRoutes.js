const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.authenticateRequest, userController.getAllUsers);
router.get('/:id', authMiddleware.authenticateRequest, userController.getUserById);

module.exports = router;
