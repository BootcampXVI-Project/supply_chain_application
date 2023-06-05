import express from "express";
import RetailerController from "../controllers/RetailerController";
import { jwtGuard } from "../middlewares /authentication/jwtGuard";
import { Roles } from "../middlewares /authentication/roleGuard";
import { UserRole } from "../middlewares /authentication/UserRole";

const router = express.Router();

router.get(
	"/product/all",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getAllRetailerProducts
);

export default router;
