import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/verify", AuthController.verify);
router.post("/resetPassword", AuthController.resetPassword);

export default router;
