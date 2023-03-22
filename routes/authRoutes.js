const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify/:verifyCode", authController.verifyRegister);
router.post("/verify", authMiddleware.authenticateRequest, authMiddleware.authorize, authController.verifyByIds);
router.post("/retrieval-request", authController.sendRetrievalPasswordRequest);
router.get("/retrieval-password/:retrievalCode/:newPassword", authController.confirmRetrievePassword);
router.post("/modify-password", authController.modifyPassword);
router.get("/refresh-token", authController.refreshToken);

module.exports = router;
