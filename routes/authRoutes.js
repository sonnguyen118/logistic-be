const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/verify/:verifyCode", authMiddleware.authenticateRequest, authMiddleware.authorize, authController.verifyRegister);

module.exports = router;
