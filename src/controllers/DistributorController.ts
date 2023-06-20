import AppService from "../appService";
import UserService from "../services/userService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

const DistributorController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const shippingStatus = String(req.query.shippingStatus);

			const userObj = await userService.getUserObjByUserId(user.userId);
			const queryObj = {
				address: userObj.address,
				shippingStatus: shippingStatus
			};

			const products = await appService.evaluateTransactionUserObjAnyParam(
				"GetAllProductsByShippingStatus",
				userObj,
				queryObj
			);

			return res.status(200).json({
				data: products,
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

	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productObj = req.body.productObj;

			if (!userObj) {
				return res.status(404).json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const data = await appService.submitTransaction(
				"UpdateProduct",
				userObj,
				productObj
			);

			return res.status(200).json({
				data: data,
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

export default DistributorController;
