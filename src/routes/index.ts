import { Express } from "express";
import imageRouter from "./imageRouter";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import productCommercialRouter from "./productCommercialRouter";
import orderRouter from "./orderRouter";
import supplierRouter from "./supplierRouter";
import manufacturerRouter from "./manufacturerRouter";
import distributorRouter from "./distributorRouter";
import retailerRouter from "./retailerRouter";

function routing(app: Express) {
	app.use("/image", imageRouter);
	app.use("/auth", authRouter);
	app.use("/user", userRouter);
	app.use("/product", productRouter);
	app.use("/product-commercial", productCommercialRouter);
	app.use("/order", orderRouter);
	app.use("/supplier", supplierRouter);
	app.use("/manufacturer", manufacturerRouter);
	app.use("/distributor", distributorRouter);
	app.use("/retailer", retailerRouter);

	app.use("*", (req, res, next) => {
		return res.status(404).json({
			message: "not-found",
			error: "not-found"
		});
	});
}

export default routing;
