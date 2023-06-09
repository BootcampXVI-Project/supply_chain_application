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
	"/product/popular",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getPopularOrderedProducts
);

export default router;
