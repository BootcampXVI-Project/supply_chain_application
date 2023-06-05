import OrderService from "../services/orderService";
import ImageService from "../services/imageService";
import { Request, Response } from "express";
import { PRODUCTION_URL } from "../constants";
import { getUserByUserId } from "../services/userService";
import { getNextCounterID } from "../services/productService";
import { submitTransaction, submitTransactionOrderAddress } from "../app";
import { DecodeUser } from "../types/common";

const orderService: OrderService = new OrderService();
const imageService: ImageService = new ImageService();

const OrderController = {
	getAllOrdersByAddress: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserByUserId(user.userId);
			const longitude = String(req.query.longitude);
			const latitude = String(req.query.latitude);
			const shippingStatus = String(req.query.shippingStatus);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
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

	getAllOrders: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserByUserId(user.userId);

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
			const userObj = await getUserByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const order = await orderService.getOrder(userObj, orderId);
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
			const userObj = await getUserByUserId(user.userId);
			const orderObj = req.body.orderObj;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			// Generate QR code for order
			const orderId = "Order1";
			//(await getNextCounterID(userId, "OrderCounterNO")) || ;
			const qrCodeString = await imageService.generateAndPublishQRCode(
				`${PRODUCTION_URL}/order/${orderId}`,
				`qrcode/orders/${orderId}.jpg`
			);
			orderObj.qrCode = qrCodeString;

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
			const userObj = await getUserByUserId(user.userId);
			const { orderObj, longitude, latitude } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const order = await submitTransactionOrderAddress(
				"UpdateOrder",
				userObj,
				orderObj,
				longitude,
				latitude
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
			const userObj = await getUserByUserId(user.userId);
			const { orderId, longitude, latitude } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const orderObj = await orderService.getOrder(userObj, orderId);
			const order = await submitTransactionOrderAddress(
				"FinishOrder",
				userObj,
				orderObj,
				longitude,
				latitude
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
