const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify/:verifyCode", authController.verifyRegister);
router.post("/retrieval-request", authController.sendRetrievalPasswordRequest);
router.post("/modify-password", authController.modifyPassword);

module.exports = router;
