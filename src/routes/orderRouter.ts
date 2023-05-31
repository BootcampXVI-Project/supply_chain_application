import express from "express";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.get("/all", OrderController.getAllOrders);
router.get("/detail", OrderController.getOrder);
router.post("/create", OrderController.createOrder);
router.patch("/update", OrderController.updateOrder);
router.post("/finish", OrderController.finishOrder);

export default router;
