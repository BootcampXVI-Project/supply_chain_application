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

router.post(
	"/export",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	ProductCommercialController.exportProduct
);

router.post(
	"/distribute",
	jwtGuard,
	Roles(UserRole.DISTRIBUTOR),
	ProductCommercialController.distributeProduct
);

router.post(
	"/retailer-import",
	jwtGuard,
	Roles(UserRole.RETAILER),
	ProductCommercialController.importRetailerProduct
);

router.post(
	"/sell",
	jwtGuard,
	Roles(UserRole.RETAILER),
	ProductCommercialController.sellProduct
);

router.get(
	"/:productId",
	jwtGuard,
	Roles(UserRole.MANUFACTURER, UserRole.DISTRIBUTOR, UserRole.RETAILER),
	ProductCommercialController.getProduct
);

export default router;
