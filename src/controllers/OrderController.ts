import OrderService from "../services/orderService";
import ImageService from "../services/imageService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { PRODUCTION_URL } from "../constants";
import { OrderForCreate, OrderForUpdateFinish } from "../types/models";
import { submitTransactionOrderObj } from "../app";
import { getUserObjByUserId } from "../services/userService";

const orderService: OrderService = new OrderService();
const imageService: ImageService = new ImageService();

const OrderController = {
	getAllOrders: async (req: Request, res: Response) => {
		try {
			const status = req.query.status;
			const statusValue = Boolean(status) ? String(status) : "";

			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.getAllOrders(userObj, statusValue);
			return res.json({
				data: orders,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllOrdersByAddress: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const longitude = String(req.query.longitude);
			const latitude = String(req.query.latitude);
			const shippingStatus = String(req.query.shippingStatus);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.getAllOrdersByAddress(
				userObj,
				longitude,
				latitude,
				shippingStatus
			);
			return res.json({
				data: orders,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllOrdersOfManufacturer: async (req: Request, res: Response) => {
		try {
			const status = req.query.status;
			const statusValue = Boolean(status) ? String(status) : "";

			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.GetAllOrdersOfManufacturer(
				userObj,
				user.userId,
				statusValue
			);
			return res.json({
				data: orders,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllOrdersOfDistributor: async (req: Request, res: Response) => {
		try {
			const status = req.query.status;
			const statusValue = Boolean(status) ? String(status) : "";

			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.GetAllOrdersOfDistributor(
				userObj,
				user.userId,
				statusValue
			);
			return res.json({
				data: orders,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllOrdersOfRetailer: async (req: Request, res: Response) => {
		try {
			const status = req.query.status;
			const statusValue = Boolean(status) ? String(status) : "";

			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.GetAllOrdersOfRetailer(
				userObj,
				user.userId,
				statusValue
			);
			return res.json({
				data: orders,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getOrder: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const orderId = String(req.params.orderId);
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const order = await orderService.getDetailOrder(userObj, orderId);
			return res.json({
				data: order,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	createOrder: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const orderObj = req.body.orderObj as OrderForCreate;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orderId = await orderService.getNextCounterID(
				userObj,
				"OrderCounterNO"
			);
			const qrCodeString = await imageService.generateAndPublishQRCode(
				`${PRODUCTION_URL}/order/${orderId}`,
				`qrcode/orders/${orderId}.jpg`
			);
			orderObj.qrCode = qrCodeString || "";

			const order = await orderService.createOrder(userObj, orderObj);
			return res.json({
				data: order,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				message: "failed",
				data: null,
				error: error.message
			});
		}
	},

	updateOrder: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const orderObj = req.body.orderObj as OrderForUpdateFinish;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const order = await submitTransactionOrderObj(
				"UpdateOrder",
				userObj,
				orderObj
			);
			return res.json({
				data: order,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	finishOrder: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const orderObj = req.body.orderObj as OrderForUpdateFinish;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const order = await submitTransactionOrderObj(
				"FinishOrder",
				userObj,
				orderObj
			);
			return res.json({
				data: order,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({ data: null, message: "failed", error: error.message });
		}
	}
};

export default OrderController;
