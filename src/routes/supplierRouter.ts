import express from "express";
import SupplierController from "../controllers/SupplierController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.get(
	"/products",
	jwtGuard,
	Roles(UserRole.SUPPLIER),
	SupplierController.getProductsBySupplierId
);

export default router;
