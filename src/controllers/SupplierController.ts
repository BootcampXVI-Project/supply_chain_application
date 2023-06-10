import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { submitTransaction } from "../app";
import { getUserObjByUserId } from "../services/userService";

const SupplierController = {
	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productObj = req.body.productObj;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await submitTransaction(
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
			console.log("updateProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default SupplierController;
