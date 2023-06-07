import express from "express";
import OrderController from "../controllers/OrderController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.get(
	"/all/by-address",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	OrderController.getAllOrdersByAddress
);

router.get(
	"/all/of-manufacturer",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	OrderController.getAllOrdersOfManufacturer
);

router.get(
	"/all/of-distributor",
	jwtGuard,
	Roles(UserRole.DISTRIBUTOR),
	OrderController.getAllOrdersOfDistributor
);

router.get(
	"/all/of-retailer",
	jwtGuard,
	Roles(UserRole.RETAILER),
	OrderController.getAllOrdersOfRetailer
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
	Roles(UserRole.RETAILER),
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
