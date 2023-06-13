import AppService from "../services/appService";
import OrderService from "../services/orderService";
import ImageService from "../services/imageService";
import UserService from "../services/userService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { PRODUCTION_URL } from "../constants";
import {
	OrderForCreate,
	OrderForUpdateFinish,
	OrderPayloadForCreate
} from "../types/models";

const appService: AppService = new AppService();
const orderService: OrderService = new OrderService();
const imageService: ImageService = new ImageService();
const userService: UserService = new UserService();

const OrderController = {
	getAllOrders: async (req: Request, res: Response) => {
		try {
			const status = req.query.status;
			const statusValue = Boolean(status) ? String(status) : "";

			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);

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
			const userObj = await userService.getUserObjByUserId(user.userId);
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
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.getAllOrdersOfManufacturer(
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
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.getAllOrdersOfDistributor(
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
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.getAllOrdersOfRetailer(
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
			const userObj = await userService.getUserObjByUserId(user.userId);

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
			const orderObj = req.body.orderObj as OrderPayloadForCreate;
			const userObj = await userService.getUserObjByUserId(user.userId);
			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const order: OrderForCreate =
				await orderService.handleOrderPayloadForCreateToOrderForCreate(
					userObj,
					orderObj
				);

			// QR Code for order
			const orderId = await orderService.getNextCounterID(
				userObj,
				"OrderCounterNO"
			);
			const qrCodeString = await imageService.generateAndPublishQRCode(
				`${PRODUCTION_URL}/order/${orderId}`,
				`qrcode/orders/${orderId}.jpg`
			);
			order.qrCode = qrCodeString || "";

			const createdOrder = await orderService.createOrder(userObj, order);
			return res.json({
				data: createdOrder,
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const orderObj = req.body.orderObj as OrderForUpdateFinish;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const order = await appService.submitTransactionOrderObj(
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const orderObj = req.body.orderObj as OrderForUpdateFinish;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const order = await appService.submitTransactionOrderObj(
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
