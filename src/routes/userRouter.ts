import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

router.post("/create", UserController.createUser);
router.get("/all", UserController.getAllUsers);
router.get("/detail", UserController.getUser);
router.post("/signup", UserController.signup);
router.post("/verify", UserController.verify);


export default router;
