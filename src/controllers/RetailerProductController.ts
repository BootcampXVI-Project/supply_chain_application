import { Request, Response } from "express";
import { getUserByUserId } from "../services/userService";
import { getProductsByRetailerId } from "../services/retailerProductService";

const RetailerProductController = {
	getAllRetailerProducts: async (req: Request, res: Response) => {
		try {
			const { userId } = req.body;
			const userObj = await getUserByUserId(userId);
			
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}
			if (userObj.role != "retailer") {
				return res.json({
					message: "Denied permission! User must be a retailer!",
					status: "unauthorized"
				});
			}

			const products = await getProductsByRetailerId(userId);
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

export default RetailerProductController;
