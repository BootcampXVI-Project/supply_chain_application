import { Express } from "express";
import productRouter from "./productRouter";
import userRouter from "./userRouter";
import cooperationRouter from "./cooperationRouter";

function routing(app: Express) {
	app.use("/product", productRouter);
	app.use("/user", userRouter);
	app.use("/cooperation", cooperationRouter);

	app.use("*", (req, res, next) => {
		res.status(404).json({
			message: "not-found",
			error: "not-found"
		});
	});
}

export default routing;
