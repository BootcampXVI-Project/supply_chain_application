import { Request, Response } from "express";
import { getUserByUserId } from "../services/userService";
import { getProductById } from "../services/productService";
import { convertBufferToJavasciptObject } from "../helpers";
import {
	evaluateTransaction,
	evaluateTransactionUserObjAnyParam,
	submitTransaction
} from "../app";

const DistributorController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			// shippingStatus: "shipped" | "shipping" | "not-shipped-yet"
			const shippingStatus = String(req.query.shippingStatus);
			const userId = String(req.body.userId);
			const userObj = await getUserByUserId(userId);
			const queryObj = {
				address: userObj.address,
				shippingStatus: shippingStatus
			};

			const productsBuffer = await evaluateTransactionUserObjAnyParam(
				"GetAllProductsByShippingStatus",
				userObj,
				queryObj
			);
			const products = convertBufferToJavasciptObject(productsBuffer);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error + ""
			});
		}
	}
};

export default DistributorController;
