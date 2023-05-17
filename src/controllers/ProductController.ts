import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	submitTransaction
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";
import { createProduct } from "../services/crudDatabase/product";
import { ObjectId } from "../constants";

const ProductController = {
	getProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const productId = String(req.query.productId);
			const userObj = await getUserByUserId(userId);

			const productBuffer = await evaluateTransactionUserObjProductId(
				"GetProduct",
				userObj,
				String(productId)
			);
			const product = convertBufferToJavasciptObject(productBuffer);

			return res.json({
				data: product,
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
	},

	getAllProducts: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const userObj = await getUserByUserId(userId);

			const productsBuffer = await evaluateTransaction(
				"GetAllProducts",
				userObj,
				null
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
				error: error
			});
		}
	},

	cultivateProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("CultivateProduct", userObj, productObj);

			const createdProduct = await createProduct(userObj.UserId, productObj);

			if (createdProduct.data) {
				return res.json({
					data: createdProduct.data,
					message: "successfully",
					error: null
				});
			} else {
				return res.json({
					data: null,
					message: "failed",
					error: createdProduct.data
				});
			}
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
