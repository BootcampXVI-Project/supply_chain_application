import express from "express";
import QRCodeController from "../controllers/QRCodeController";

const router = express.Router();

router.post("/generate/", QRCodeController.generateQRCode);

export default router;
