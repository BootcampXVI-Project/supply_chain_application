import OrderService from "../services/orderService";
import ImageService from "../services/imageService";
import { Request, Response } from "express";
import { PRODUCTION_URL } from "../constants";
import { getUserByUserId } from "../services/userService";
import { getNextCounterID } from "../services/productService";
import { submitTransaction, submitTransactionOrderAddress } from "../app";

const orderService: OrderService = new OrderService();
const imageService: ImageService = new ImageService();

const OrderController = {
	getAllOrdersByAddress: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const longitude = String(req.query.longitude);
			const latitude = String(req.query.latitude);
			const shippingStatus = String(req.query.shippingStatus);

			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (
				userObj.role.toLowerCase() != "manufacturer" &&
				userObj.role.toLowerCase() != "distributor" &&
				userObj.role.toLowerCase() != "retailer"
			) {
				return res.json({
					data: null,
					message:
						"Denied permission! User must be a manufacturer or distributor or retailer!",
					error: "unauthorize"
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
			const userId = String(req.query.userId);
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (
				userObj.role.toLowerCase() != "manufacturer" &&
				userObj.role.toLowerCase() != "distributor" &&
				userObj.role.toLowerCase() != "retailer"
			) {
				return res.json({
					data: null,
					message:
						"Denied permission! User must be a manufacturer or distributor or retailer!",
					error: "unauthorize"
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
			const userId = String(req.query.userId);
			const orderId = String(req.query.orderId);
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (
				userObj.role.toLowerCase() != "manufacturer" &&
				userObj.role.toLowerCase() != "distributor" &&
				userObj.role.toLowerCase() != "retailer"
			) {
				return res.json({
					data: null,
					message:
						"Denied permission! User must be a manufacturer or distributor or retailer!",
					error: "unauthorize"
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
			const { userId, orderObj } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "manufacturer") {
				return res.json({
					message: "Denied permission! User must be a manufacturer!",
					status: "unauthorize"
				});
			}

			// Generate QR code for order
			const orderId = "Order1";
			//(await getNextCounterID(userId, "OrderCounterNO")) || ;
			const qrCodeString = await imageService.generateAndPublishQRCode(
				`${PRODUCTION_URL}/order/detail?orderId=${orderId}`,
				`qrcode/orders/${orderId}`
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
			const { userId, orderObj, longitude, latitude } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "distributor") {
				return res.json({
					message: "Denied permission! User must be a distributor!",
					status: "unauthorize"
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
			const { userId, orderId, longitude, latitude } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "distributor") {
				return res.json({
					message: "Denied permission! User must be a distributor!",
					status: "unauthorize"
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
