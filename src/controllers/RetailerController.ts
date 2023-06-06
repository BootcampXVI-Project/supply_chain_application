import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { getUserByUserId } from "../services/userService";
import { getProductsByRetailerId } from "../services/retailerService";

const RetailerController = {
	getAllRetailerProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}

			const products = await getProductsByRetailerId(user.userId);
			if (products == null) {
				return res.json({
					message: "This retailer don't have any product!",
					status: "notfound"
				});
			}

			return res.json({
				data: products,
				message: "successful",
				error: null
			});
		} catch (error) {
			console.log("getAllRetailerProducts", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default RetailerController;
