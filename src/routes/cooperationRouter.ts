import express from "express";
import CooperationController from "../controllers/CooperationController";

const router = express.Router();

router.get("/all", CooperationController.getAllCooperations);
router.get("/detail", CooperationController.getCooperation);
router.post("/create", CooperationController.createCooperation);
router.patch("/update", CooperationController.updateCooperation);
router.delete("/delete", CooperationController.deleteCooperation);

export default router;
