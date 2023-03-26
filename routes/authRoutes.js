const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/permission", authMiddleware.authenticateRequest, authMiddleware.authorize, authController.getAllPermissions);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify/:verifyCode", authController.verifyRegister);
router.post("/verify", authMiddleware.authenticateRequest, authMiddleware.authorize, authController.verifyByIds);
router.post("/retrieval-request", authController.sendRetrievalPasswordRequest);
router.get("/retrieval-password/:retrievalCode/:newPassword", authController.confirmRetrievePassword);
router.post("/modify-password", authController.modifyPassword);
router.get("/refresh-token", authController.refreshToken);
router.post("/grant-permission", authMiddleware.authenticateRequest, authMiddleware.authorize, authController.grantPermission);

module.exports = router;
