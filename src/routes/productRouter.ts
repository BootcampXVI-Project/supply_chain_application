import express from "express";
import ProductController from "../controllers/ProductController";

const router = express.Router();

router.get("/all", ProductController.getAllProducts);
router.get("/detail", ProductController.getProduct);

router.post("/cultivate", ProductController.cultivateProduct);
router.post("/harvert", ProductController.harvertProduct);
router.post("/import", ProductController.importProduct);
router.post("/manufacture", ProductController.manufactureProduct);
router.post("/export", ProductController.exportProduct);
router.post("/distribute", ProductController.distributeProduct);
router.post("/sell", ProductController.sellProduct);

router.patch("/update", ProductController.updateProduct);

export default router;
