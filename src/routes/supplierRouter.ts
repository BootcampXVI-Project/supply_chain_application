import express from "express";
import SupplierController from "../controllers/SupplierController";
import UserRole from "../middleware/authentication/UserRole";
import { jwtGuard } from "../middleware/authentication/jwtGuard";
import { Roles } from "../middleware/authentication/roleGuard";

const router = express.Router();

router.patch(
	"/product/update",
	jwtGuard,
	Roles(UserRole.RETAILER),
	SupplierController.updateProduct
);

export default router;
