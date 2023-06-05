import express from "express";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.get("/all/by-address", OrderController.getAllOrdersByAddress);
router.get("/all", OrderController.getAllOrders);
router.post("/create", OrderController.createOrder);
router.patch("/update", OrderController.updateOrder);
router.post("/finish", OrderController.finishOrder);
router.get("/", OrderController.getOrder);

export default router;
