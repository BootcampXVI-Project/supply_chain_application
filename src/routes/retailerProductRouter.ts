import RetailerProductController from "../controllers/RetailerProductController";
import express from "express";

const router = express.Router();

router.get("/all", RetailerProductController.getAllRetailerProducts);

export default router