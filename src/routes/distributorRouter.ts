import express from "express";
import DistributorController from "../controllers/DistributorController";

const router = express.Router();

router.get("/product/all", DistributorController.getAllProducts);
router.patch("/product/update", DistributorController.updateProduct);

export default router;
