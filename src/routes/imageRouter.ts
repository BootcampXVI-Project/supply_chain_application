import express from "express";
import ImageController from "../controllers/ImageController";

const router = express.Router();
const imageController: ImageController = new ImageController();

router.post("/upload", imageController.upload);
router.post("/publish-base64", imageController.base64ToPublicImage);

export default router;
