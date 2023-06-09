import ImageService from "../services/imageService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { PRODUCTION_URL } from "../constants";
import { ProductForCultivate } from "../types/models";
import { getUserObjByUserId } from "../services/userService";
import { convertBufferToJavasciptObject } from "../helpers";
import {
	getProductById,
	getAllProducts,
	getDetailProductById
} from "../services/productService";
import {
	evaluateTransaction,
	submitTransaction,
	submitTransactionCultivateProduct
} from "../app";

const imageService: ImageService = new ImageService();

const ProductController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await getAllProducts(user.userId);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("getAllProducts", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productId = String(req.params.productId);
			const userObj = await getUserObjByUserId(user.userId);
			const product = await getDetailProductById(productId, userObj);

			return res.json({
				data: product,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("getProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getTransactionsHistory: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productId = String(req.query.productId);
			const userObj = await getUserObjByUserId(user.userId);
			const productObj = await getProductById(productId, userObj);

			const transactionsBuffer = await evaluateTransaction(
				"GetProductTransactionHistory",
				userObj,
				productObj
			);
			const transactions = await convertBufferToJavasciptObject(
				transactionsBuffer
			);
			return res.json({
				data: transactions,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("getTransactionsory", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	cultivateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productObj = req.body.productObj as ProductForCultivate;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const data = await submitTransactionCultivateProduct(
				"CultivateProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("cultivateProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	harvestProduct: async (req: Request, res: Response) => {
		try {
			const productId = String(req.body.productId);
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "cultivating") {
				return res.json({
					message: "Product is not cultivated or was harvested"
				});
			}

			const data = await submitTransaction(
				"HarvestProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("harvestProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const productObj = req.body.productObj;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const data = await submitTransaction(
				"UpdateProduct",
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
	},

	importProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}
			if (productObj.status.toLowerCase() != "harvested") {
				return res.json({
					message: "Product is not harvested or was imported"
				});
			}

			productObj.price = price;
			const data = await submitTransaction(
				"ImportProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("importProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	manufactureProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const { productId, imageUrl, expireTime } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "user-notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "product-notfound"
				});
			}
			if (productObj.status.toLowerCase() != "imported") {
				return res.json({
					message: "Product is not imported or was manufactured",
					status: "failed"
				});
			}

			const qrCodeString = await imageService.generateAndPublishQRCode(
				`${PRODUCTION_URL}/product/${productId}`,
				`qrcode/products/${productId}.jpg`
			);
			productObj.qrCode = qrCodeString || "";
			productObj.expireTime = expireTime;
			productObj.image = imageUrl;

			const data = await submitTransaction(
				"ManufactureProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("manufactureProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	exportProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}
			if (productObj.status.toLowerCase() != "manufactured") {
				return res.json({
					message: "Product is not manufactured or was exported"
				});
			}

			productObj.price = price;
			const data = await submitTransaction(
				"ExportProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("exportProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	distributeProduct: async (req: Request, res: Response) => {
		try {
			const productId = String(req.body.productId);
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "exported") {
				return res.json({
					message: "Product is not exported or was distributed"
				});
			}

			const data = await submitTransaction(
				"DistributeProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("distributeProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	importRetailerProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}
			if (productObj.status.toLowerCase() != "distributed") {
				return res.json({
					message: "Product is not distributed or was selling"
				});
			}

			productObj.price = price;
			const data = await submitTransaction(
				"ImportRetailerProduct",
				userObj,
				productObj
			);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("importRetailProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	sellProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				return res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}
			if (productObj.status.toLowerCase() != "selling") {
				return res.json({
					message: "Product is not selling or was sold"
				});
			}

			productObj.price = price;
			const data = await submitTransaction("SellProduct", userObj, productObj);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("sellProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
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
		// 		error: error.message
		// 	});
		// }
	}
};

export default ProductController;
