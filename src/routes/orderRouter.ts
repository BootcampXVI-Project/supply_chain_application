import express from "express";
import OrderController from "../controllers/OrderController";
import UserRole from "../middleware/authentication/UserRole";
import { jwtGuard } from "../middleware/authentication/jwtGuard";
import { Roles } from "../middleware/authentication/roleGuard";

const router = express.Router();

router.get(
	"/all/by-address",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	OrderController.getAllOrdersByAddress
);

router.get(
	"/all",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	OrderController.getAllOrders
);

router.post(
	"/create",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	OrderController.createOrder
);

router.patch(
	"/update",
	jwtGuard,
	Roles(UserRole.DISTRIBUTOR),
	OrderController.updateOrder
);

router.post(
	"/finish",
	jwtGuard,
	Roles(UserRole.DISTRIBUTOR),
	OrderController.finishOrder
);

router.get(
	"/:orderId",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	OrderController.getOrder
);

export default router;
