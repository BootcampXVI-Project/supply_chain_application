import express from "express";
import ManufacturerController from "../controllers/ManufacturerController";
import UserRole from "../middlewares/authentication/UserRole";
import { jwtGuard } from "../middlewares/authentication/jwtGuard";
import { Roles } from "../middlewares/authentication/roleGuard";

const router = express.Router();

router.patch(
	"/order/approve",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	ManufacturerController.approveOrderRequest
);

export default router;
