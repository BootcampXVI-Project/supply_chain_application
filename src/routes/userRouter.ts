import express from "express";
import UserController from "../controllers/UserController";
import { jwtGuard } from "../middlewares /authentication/jwtGuard";
import { Roles } from "../middlewares /authentication/roleGuard";
import { UserRole } from "../middlewares /authentication/UserRole";

const router = express.Router();

router.post("/create", UserController.createUser);

router.get(
	"/all",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	UserController.getAllUsers
);

router.get(
	"/:userId",
	jwtGuard,
	Roles(UserRole.MANUFACTURER),
	UserController.getUser
);

export default router;
