import OrderService from "../services/orderService";
import { Request, Response } from "express";
import { submitTransaction } from "../app";
import { getUserByUserId } from "../services/userService";

const orderService = new OrderService();

const OrderController = {
	getAllOrders: async (req: Request, res: Response) => {
		try {
			const { userId } = req.body;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const orders = await orderService.getAllOrders(userObj);
			return res.json({
				data: orders,
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

	getOrder: async (req: Request, res: Response) => {
		try {
			const { userId, orderId } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (
				userObj.role.toLowerCase() != "manufacturer" ||
				userObj.role.toLowerCase() != "distributor" ||
				userObj.role.toLowerCase() != "retailer"
			) {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const order = await orderService.getOrder(userObj, orderId);
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
			const { userId, orderObj } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "distributor") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const order = await orderService.createOrder(userObj, orderObj);
			return res.json({
				data: order,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	updateOrder: async (req: Request, res: Response) => {
		try {
			const { userId, orderId } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "distributor") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const orderObj = await orderService.getOrder(userObj, orderId);
			const order = await submitTransaction("UpdateOrder", userObj, orderObj);

			return res.json({
				data: order,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("updateOrder", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	finishOrder: async (req: Request, res: Response) => {
		try {
			const { userId, orderId } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "retailer") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const orderObj = await orderService.getOrder(userObj, orderId);
			const order = await submitTransaction("FinishOrder", userObj, orderObj);

			return res.json({
				data: order,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	}
};

export default OrderController;
