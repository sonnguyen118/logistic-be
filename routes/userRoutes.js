const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const { uploadAvatar } = require("../services/uploadImageService");

const router = express.Router();

router.get("/", authMiddleware.authenticateRequest, authMiddleware.authorize, userController.getAllUsers);
router.get("/:id", authMiddleware.authenticateRequest, userController.getUserById);
router.post("/update", authMiddleware.authenticateRequest, userController.updateUserInfo);
router.post("/upload-avatar", authMiddleware.authenticateRequest, uploadAvatar.single('avatar'), function (req, res) { res.json("upload success") });
router.get("/:id/role", authMiddleware.authenticateRequest, userController.getUserRoleById);


module.exports = router;
