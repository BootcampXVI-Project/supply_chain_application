import express from "express";
import ImageController from "../controllers/ImageController";

const router = express.Router();

let imageController: ImageController;

router.post("/upload", imageController.upload);

export default router;
