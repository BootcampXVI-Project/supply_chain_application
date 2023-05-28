import express from "express";
import DistributorController from "../controllers/DistributorController";

const router = express.Router();

router.get("/product", DistributorController.getAllProducts);

export default router;
