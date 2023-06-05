import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { submitTransaction } from "../app";
import { getUserByUserId } from "../services/userService";

const SupplierController = {
	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			await submitTransaction("SupplierUpdateProduct", userObj, productObj);

			return res.json({
				data: null,
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
