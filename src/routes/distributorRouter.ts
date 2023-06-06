import express from "express";
import DistributorController from "../controllers/DistributorController";
import UserRole from "../middleware/authentication/UserRole";
import { jwtGuard } from "../middleware/authentication/jwtGuard";
import { Roles } from "../middleware/authentication/roleGuard";

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
