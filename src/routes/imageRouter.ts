import express from "express";
import ImageController from "../controllers/ImageController";

const router = express.Router();

router.post("/upload", ImageController.upload);

router.post(
	"/generate-publish-qrcode",
	ImageController.generateAndPublishQRCode
);

export default router;
