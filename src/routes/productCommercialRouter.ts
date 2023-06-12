import express from "express";
import ProductCommercialController from "../controllers/ProductCommercialController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.get(
	"/all",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	ProductCommercialController.getAllProducts
);

router.get(
	"/:productId",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	ProductCommercialController.getProduct
);

export default router;
