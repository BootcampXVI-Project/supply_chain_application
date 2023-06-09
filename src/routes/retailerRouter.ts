import express from "express";
import RetailerController from "../controllers/RetailerController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.get(
	"/product/all",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getAllRetailerProducts
);

router.get(
	"/product/manufactured",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getManufacturedProducts
);

router.get(
	"/product/ordered",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getAllOrderedProducts
);

router.get(
	"/product/popular-ordered",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getPopularOrderedProducts
);

router.get(
	"/cart/view",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getCart
);

router.patch(
	"/cart/add",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.addCart
);

router.patch(
	"/cart/delete",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.deteleCart
);

router.patch(
	"/cart/delete-product",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.deteleProductInCart
);

export default router;
