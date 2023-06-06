import express from "express";
import DistributorController from "../controllers/DistributorController";
import UserRole from "../middlewares /authentication/UserRole";
import { jwtGuard } from "../middlewares /authentication/jwtGuard";
import { Roles } from "../middlewares /authentication/roleGuard";

const router = express.Router();

router.get(
	"/product/all",
	jwtGuard,
	Roles(UserRole.DISTRIBUTOR),
	DistributorController.getAllProducts
);

router.patch(
	"/product/update",
	jwtGuard,
	Roles(UserRole.DISTRIBUTOR),
	DistributorController.updateProduct
);

export default router;
