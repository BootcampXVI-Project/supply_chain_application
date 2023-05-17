import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	submitTransaction
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";

const ProductController = {
	// DOING
	createUser: async (req: Request, res: Response) => {
		try {
			const userObj = req.body.userObj;

			await submitTransaction("CreateUser", userObj, null);

			// const createdProduct = await createProduct(userObj.UserId, productObj);

			// if (createdProduct.data) {
			// 	return res.json({
			// 		data: createdProduct.data,
			// 		message: "successfully",
			// 		error: null
			// 	});
			// } else {
			// 	return res.json({
			// 		data: null,
			// 		message: "failed",
			// 		error: createdProduct.data
			// 	});
			// }

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	}
};

export default ProductController;
