const express = require("express");
const articleController = require("../controllers/articleController");
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadArticle } = require("../services/uploadImageService");

const router = express.Router();

router.get("/", authMiddleware.authenticateRequest, articleController.getArticles);
router.post("/add", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.addArticle);
router.post("/update", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.updateArticle);
router.post("/upload-img", authMiddleware.authenticateRequest, uploadArticle.single('img'), function (req, res) { res.status(200).json({ success: true, message: "success" }) });
router.post("/:link", articleController.getArticleByLink);
router.post("/", articleController.getArticleById);

router.post("/ckeditor_image", async (req, res) => {
    try {
        if (req.files.upload != undefined) {
            var adress_file = "/upload/article/" + file.name;
            return res
                .status(201)
                .send(
                    "<script>window.parent.CKEDITOR.tools.callFunction('" +
                    req.query.CKEditorFuncNum +
                    "','" +
                    adress_file +
                    "');</script>"
                );
        }
    } catch (error) {
        res.send("Error uploading file");
        return;
    }
});

module.exports = router;
