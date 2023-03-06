const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.authenticateUser, userController.getAllUsers);
router.get('/:id', authMiddleware.authenticateUser, userController.getUserById);

module.exports = router;
