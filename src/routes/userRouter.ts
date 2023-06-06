import express from "express";
import UserController from "../controllers/UserController";
import UserRole from "../middleware/authentication/UserRole";
import { jwtGuard } from "../middleware/authentication/jwtGuard";
import { Roles } from "../middleware/authentication/roleGuard";

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
