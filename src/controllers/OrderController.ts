import { Request, Response } from "express";
import { submitTransaction } from "../app";
import { getUserByUserId } from "../services/crudDatabase/user";

const OrderController = {
	createOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			await submitTransaction("CreateOrder", userObj, orderObj);

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	updateOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			await submitTransaction("UpdateOrder", userObj, orderObj);

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	finishOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			await submitTransaction("FinishOrder", userObj, orderObj);

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	}
};

export default OrderController;
