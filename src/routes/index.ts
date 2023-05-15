import { Express } from "express";
import productRouter from "./productRouter";

function routing(app: Express) {
	app.use("/product", productRouter);

	app.use("*", (req, res, next) => {
		res.status(404).json({
			message: "not-found",
			error: "not-found"
		});
	});
}

export default routing;
