import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();

let authController: AuthController = new AuthController();

router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.post("/resetPassword", authController.resetPassword);

export default router;
