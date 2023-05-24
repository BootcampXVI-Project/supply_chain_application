import express from "express";
import QRCodeController from "../controllers/QRCodeController";

const router = express.Router();

router.post("/generate/:productId", QRCodeController.generateQRCode);

export default router;
