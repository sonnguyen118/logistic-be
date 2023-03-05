const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/users', authMiddleware.authenticateUser, userController.getAllUsers);
router.get('/users/:id', authMiddleware.authenticateUser, userController.getUserById);
router.get('/test', function handler(req, res) {
    res.status(200).json({ name: 'John Doe' })
  });

module.exports = router;
