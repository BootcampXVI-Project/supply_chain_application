import UserService from "../services/userService";
import OrderService from "../services/orderService";
import ManufacturerService from "../services/manufacturerService";
import ProductCommercialService from "../services/productCommercialService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { ProductCommercialItem } from "../types/models";

const userService: UserService = new UserService();
const orderService: OrderService = new OrderService();
const manufacturerService: ManufacturerService = new ManufacturerService();
const productCommercialService: ProductCommercialService =
	new ProductCommercialService();

const ManufacturerController = {
	approveOrderRequest: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const orderId = String(req.body.orderId);
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.status(404).json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const updatedOrder = await manufacturerService.approveOrderRequest(
				userObj,
				orderId
			);

			// Backup
			orderService.updateOrderDB(orderId, updatedOrder);
			updatedOrder.productItemList.map((productItem: ProductCommercialItem) =>
				productCommercialService.updateProductDB(
					productItem.product.productCommercialId,
					productItem.product
				)
			);

			return res.status(200).json({
				data: updatedOrder,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	rejectOrderRequest: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const orderId = String(req.body.orderId);
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.status(404).json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const updatedOrder = await manufacturerService.rejectOrderRequest(
				userObj,
				orderId
			);

			// Backup
			orderService.updateOrderDB(orderId, updatedOrder);
			updatedOrder.productItemList.map((productItem: ProductCommercialItem) =>
				productCommercialService.updateProductDB(
					productItem.product.productCommercialId,
					productItem.product
				)
			);

			return res.status(200).json({
				data: updatedOrder,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default ManufacturerController;
