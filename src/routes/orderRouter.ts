import express from "express";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.post("/create", OrderController.createOrder);
router.patch("/update", OrderController.updateOrder);
router.post("/finish", OrderController.finishOrder);

export default router;
