import AppService from "../services/appService";
import OrderService from "../services/orderService";
import UserService from "../services/userService";
import ProductCommercialService from "../services/productCommercialService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import {
	OrderForCreate,
	OrderForUpdateFinish,
	OrderPayloadForCreate,
	ProductCommercialItem
} from "../types/models";

const appService: AppService = new AppService();
const userService: UserService = new UserService();
const orderService: OrderService = new OrderService();
const productCommercialService: ProductCommercialService =
	new ProductCommercialService();

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
			const address = String(req.query.address);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const orders = await orderService.getAllOrdersByAddress(userObj, address);
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
			order.qrCode = await orderService.generateOrderQRCode(userObj);

			const createdOrder = await orderService.createOrder(userObj, order);

			// Backup
			orderService.createOrderDB(createdOrder);
			createdOrder.productItemList.map((productItem: ProductCommercialItem) =>
				productCommercialService.createProductDB(productItem.product)
			);

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

			const updatedOrder = await appService.submitTransactionOrderObj(
				"UpdateOrder",
				userObj,
				orderObj
			);

			// Backup
			orderService.updateOrderDB(orderObj.orderId, updatedOrder);
			updatedOrder.productItemList.map((productItem: ProductCommercialItem) =>
				productCommercialService.updateProductDB(
					productItem.product.productCommercialId,
					productItem.product
				)
			);

			return res.json({
				data: updatedOrder,
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

			const updatedOrder = await appService.submitTransactionOrderObj(
				"FinishOrder",
				userObj,
				orderObj
			);

			// Backup
			orderService.updateOrderDB(orderObj.orderId, updatedOrder);
			updatedOrder.productItemList.map((productItem: ProductCommercialItem) =>
				productCommercialService.updateProductDB(
					productItem.product.productCommercialId,
					productItem.product
				)
			);

			return res.json({
				data: updatedOrder,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({ data: null, message: "failed", error: error.message });
		}
	}
};

export default OrderController;
