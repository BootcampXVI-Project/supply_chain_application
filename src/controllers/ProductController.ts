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
import { log } from "console";
import { FirebaseStorage } from "firebase/storage";

const ProductController = {
	// DONE
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

	// DONE
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

	// ERROR - SAVE INTO DB
	//Supplier
	cultivateProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("CultivateProduct", userObj, productObj);

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
	},

	harvertProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("HarvertProduct", userObj, productObj);

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
	},

	addCertificate: async (req:Request, res: Response) => {
		try {
			const { userObj, productObj } = req.body;
			let product = await ProductController.getProduct(req, res)
			if (!product) {
				throw new Error("Content not found !!!");
			}

			const base64String = productObj.split("base64,")[1];
			const bytesImage = Buffer.from(base64String, "base64");
			const storage = new FirebaseStorage("supplychain.app.com");
			const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(bytesImage); }, pull() { }, cancel() { } });

			product.CertificateUrl = await storage.child("Certificate").put(stream);
			const result = await submitTransaction(
				"AddCertificate",
				userObj,
				product
			);

			return res.json({
				data: result,
				message: "successfully",
				error: null
			})
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