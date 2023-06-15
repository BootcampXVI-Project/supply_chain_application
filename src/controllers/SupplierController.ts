import AppService from "../appService";
import UserService from "../services/userService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

const SupplierController = {
	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productObj = req.body.productObj;
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await appService.submitTransaction(
				"SupplierUpdateProduct",
				userObj,
				productObj
			);
			return res.json({
				data: data,
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
	}
};

export default SupplierController;
