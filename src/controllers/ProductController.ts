import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	submitTransaction
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";
import ImageService from "../services/crudDatabase/image";
import {
	createProduct,
	getProductByProductId
} from "../services/crudDatabase/product";
import { ObjectId } from "../constants";
import { log } from "console";
import { User } from "../models/UserModel";
import { FirebaseStorage } from "firebase/storage";

const imageService = ImageService;

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
			log("Err", error);
			return res.json({
				data: null,
				message: "failed",
				error: error + ""
			});
		}
	},

	getTransactionsHistory: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const productId = String(req.query.productId);

			const userObj = await getUserByUserId(userId);
			const productObj = await getProductByProductId(productId);
			console.log("userObj", userObj);
			console.log("productObj", productObj);

			const transactionsBuffer = await evaluateTransaction(
				"GetHistory",
				userObj,
				productObj
			);
			console.log("transactionsBuffer", transactionsBuffer);
			const transactions = convertBufferToJavasciptObject(transactionsBuffer);
			console.log("transactions", transactions);

			return res.json({
				data: transactions,
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

			console.log(userId);
			console.log(userObj);

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

	importProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("ImportProduct", userObj, productObj);

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

	manufactureProduct: async (req: Request, res: Response) => {
		try {
			// const imageUrl = req.body.imageUrl;
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			const imageArray = productObj.image;
			let imageUrls = [];

			for (let i of imageArray) {
				const uploadedImageUrl =
					(await imageService.upload(
						i,
						"image product/" + productObj.productName + "/" + Date.now()
					)) + ".jpg";
				imageUrls.push(uploadedImageUrl);
			}
			productObj.image = imageUrls;
			await submitTransaction("ManufactureProduct", userObj, productObj);

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log(error);
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	exportProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("ExportProduct", userObj, productObj);

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

	distributeProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("DistributeProduct", userObj, productObj);

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

	sellProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("SellProduct", userObj, productObj);

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

	updateProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			await submitTransaction("SupplierUpdateProduct", userObj, productObj);

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

	addCertificate: async (req: Request, res: Response) => {
		// try {
		// 	const { userObj, productObj } = req.body;
		// 	let product = await ProductController.getProduct(req, res)
		// 	if (!product) {
		// 		throw new Error("Content not found !!!");
		// 	}
		// 	const base64String = productObj.split("base64,")[1];
		// 	const bytesImage = Buffer.from(base64String, "base64");
		// 	const storage = new FirebaseStorage("supplychain.app.com");
		// 	const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(bytesImage); }, pull() { }, cancel() { } });
		// 	product.CertificateUrl = await storage.child("Certificate").put(stream);
		// 	const result = await submitTransaction(
		// 		"AddCertificate",
		// 		userObj,
		// 		product
		// 	);
		// 	return res.json({
		// 		data: result,
		// 		message: "successfully",
		// 		error: null
		// 	})
		// } catch (error) {
		// 	return res.json({
		// 		data: null,
		// 		message: "failed",
		// 		error: error
		// 	});
		// }
	},

	createOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			await submitTransaction("CreateOrder", userObj, orderObj);

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

	updateOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			await submitTransaction("UpdateOrder", userObj, orderObj);

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

	finishOrder: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const orderObj = req.body.orderObj;
			const userObj = await getUserByUserId(userId);

			console.log(userId);
			console.log(userObj);

			await submitTransaction("FinishOrder", userObj, orderObj);

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
