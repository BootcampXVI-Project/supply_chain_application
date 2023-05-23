import { Request, Response } from "express";
import { getAllRetailerProducts, getProductByRetailerId } from "../services/crudDatabase/retailerProduct";
import { getUserByUserId } from "../services/crudDatabase/user";

const RetailerProductController = {
	getAllRetailerProducts: async (req: Request, res: Response) => {
		try {
			const { userId } = req.body
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				})
			}

			if (userObj.role.toLowerCase() != "retailer") {
				return res.json({
					message: "Not Allowed!",
					status: "unauthorized"
				})
			}

			const products = await getProductByRetailerId(userId);
			if (products == null) {
				return res.json({
					message: "This retailer don't have any product!",
					status: "notfound"
				})
			}

			return res.json({
				data: products,
				message: "successful",
				status: "success"
			})
		} catch (e) {
			console.log("DEBUG", e);
			return res.json({
				message: "failed!",
				status: "failed"
			})
		}
	}
}

export default RetailerProductController;