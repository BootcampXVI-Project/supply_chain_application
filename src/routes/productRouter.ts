import express from "express";
import ProductController from "../controllers/ProductController";

const router = express.Router();

router.get("/all", ProductController.getAllProducts);
router.get("/", ProductController.getProduct);
router.post("/cultivate", ProductController.cultivateProduct);
router.post("/harvert", ProductController.harvertProduct);

export default router;
