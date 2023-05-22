import { Express } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import cooperationRouter from "./cooperationRouter";

function routing(app: Express) {
	app.use("/auth", authRouter);
	app.use("/user", userRouter);
	app.use("/product", productRouter);
	app.use("/cooperation", cooperationRouter);

	app.use("*", (req, res, next) => {
		res.status(404).json({
			message: "not-found",
			error: "not-found"
		});
	});
}

export default routing;
