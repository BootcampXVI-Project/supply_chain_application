import express from "express";
import RetailerController from "../controllers/RetailerController";
import UserRole from "../middleware/authentication/UserRole";
import { jwtGuard } from "../middleware/authentication/jwtGuard";
import { Roles } from "../middleware/authentication/roleGuard";

const router = express.Router();

router.get(
	"/product/all",
	jwtGuard,
	Roles(UserRole.RETAILER),
	RetailerController.getAllRetailerProducts
);

export default router;
