import { Express } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import cooperationRouter from "./cooperationRouter";
import retailerProductRouter from "./retailerProductRouter"

function routing(app: Express) {
	app.use("/auth", authRouter);
	app.use("/user", userRouter);
	app.use("/product", productRouter);
	app.use("/cooperation", cooperationRouter);
	app.use("/retailer", retailerProductRouter);

	app.use("*", (req, res, next) => {
		res.status(404).json({
			message: "not-found",
			error: "not-found"
		});
	});
}

export default routing;
