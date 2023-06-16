import express from "express";
import ProductController from "../controllers/ProductController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.get(
	"/transaction-history/:productId",
	jwtGuard,
	Roles(UserRole.SUPPLIER, UserRole.MANUFACTURER),
	ProductController.getTransactionHistory
);

router.get(
	"/all",
	jwtGuard,
	Roles(
		UserRole.SUPPLIER,
		UserRole.MANUFACTURER,
		UserRole.DISTRIBUTOR,
		UserRole.RETAILER
	),
	ProductController.getAllProducts
);

router.get(
	"/transactions-history",
	jwtGuard,
	Roles(
		UserRole.SUPPLIER,
		UserRole.MANUFACTURER,
		UserRole.DISTRIBUTOR,
		UserRole.RETAILER
	),
	ProductController.getTransactionsHistory
);

router.post(
	"/cultivate",
	jwtGuard,
	Roles(UserRole.SUPPLIER),
	ProductController.cultivateProduct
);

router.post(
	"/harvest",
	jwtGuard,
	Roles(UserRole.SUPPLIER),
	ProductController.harvestProduct
);

router.post(
	"/import",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	ProductController.importProduct
);

router.post(
	"/manufacture",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	ProductController.manufactureProduct
);

router.patch(
	"/update",
	jwtGuard,
	Roles(
		UserRole.SUPPLIER,
		UserRole.MANUFACTURER,
		UserRole.DISTRIBUTOR,
		UserRole.RETAILER
	),
	ProductController.updateProduct
);

router.get(
	"/:productId",
	jwtGuard,
	// Roles(
	// 	// UserRole.SUPPLIER,
	// 	// UserRole.MANUFACTURER,
	// 	// UserRole.DISTRIBUTOR,
	// 	// UserRole.RETAILER,
	// 	// UserRole.CONSUMER
	// ),
	ProductController.getProduct
);

export default router;
