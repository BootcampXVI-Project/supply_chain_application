import { Request, Response } from "express";
import { evaluateTransaction, submitTransaction } from "../app";
import { getUserByUserId } from "../services/crudDatabase/user";

import OrderService from "../services/crudDatabase/order"

const orderService = new OrderService()

const OrderController = {

	getOrder: async (req: Request, res: Response)=> {
		try {
			const { userId, orderId } = req.body
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "distributor" && userObj.role.toLowerCase() != "retailer") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}
			console.log(userId);
			console.log(userObj);

			const order = await orderService.getOrder(userObj, orderId)

			return res.json({
				data: order,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				status: "failed"
			});
		}
	},

	createOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			const order = await orderService.createOrder(userObj, orderObj)

			return res.json({
				data: order,
				message: "successfully",
				status: "success"
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
