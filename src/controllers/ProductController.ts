import AppService from "../services/appService";
import ImageService from "../services/imageService";
import UserService from "../services/userService";
import ProductService from "../services/productService";
import { Request, Response } from "express";
import { PRODUCTION_URL } from "../constants";
import { DecodeUser } from "../types/common";
import { Product } from "../types/models";
import { ProductForCultivate } from "../types/models";

const appService: AppService = new AppService();
const imageService: ImageService = new ImageService();
const userService: UserService = new UserService();
const productService: ProductService = new ProductService();

const ProductController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await productService.getAllProducts(user.userId);
			const sortedProducts = products.sort(
				(a: Product, b: Product) =>
					parseInt(a.productId.slice(7)) - parseInt(b.productId.slice(7))
			);

			return res.json({
				data: sortedProducts,
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const product = await productService.getProductById(userObj, productId);

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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productObj = await productService.getProductById(
				userObj,
				productId
			);

			const transactions = await appService.evaluateTransaction(
				"GetProductTransactionHistory",
				userObj,
				productObj
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productObj = req.body.productObj as ProductForCultivate;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await appService.submitTransactionCultivateProduct(
				"CultivateProduct",
				userObj,
				productObj
			);

			productService.createProductDB(data);

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
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productService.getProductById(
				userObj,
				productId
			);
			if (!productObj) {
				return res.json({
					data: null,
					message: "Product not found!",
					error: "product-notfound"
				});
			}

			if (productObj.status.toLowerCase() != "cultivated") {
				return res.json({
					data: null,
					message: "Product is not cultivated or was harvested",
					error: "product-not-cultivated-or-was-harvested"
				});
			}

			const data = await appService.submitTransaction(
				"HarvestProduct",
				userObj,
				productObj
			);

			productService.updateProductDB(productId, data);

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

	importProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productService.getProductById(
				userObj,
				productId
			);
			if (!productObj) {
				return res.json({
					data: null,
					message: "Product not found!",
					error: "product-notfound"
				});
			}
			if (productObj.status.toLowerCase() != "harvested") {
				return res.json({
					data: null,
					message: "Product is not harvested or was imported",
					error: "product-is-not-harvested-or-was-imported"
				});
			}

			productObj.price = price;
			const data = await appService.submitTransaction(
				"ImportProduct",
				userObj,
				productObj
			);

			productService.updateProductDB(productId, data);

			return res.json({
				data: data,
				message: "successfully",
				error: null
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const { productId, imageUrl, expireTime } = req.body;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productService.getProductById(
				userObj,
				productId
			);
			if (!productObj) {
				return res.json({
					data: null,
					message: "Product not found!",
					error: "product-notfound"
				});
			}
			if (productObj.status.toLowerCase() != "imported") {
				return res.json({
					data: null,
					message: "Product is not imported or was manufactured",
					error: "product-is-not-imported-or-was-manufactured"
				});
			}

			const qrCodeString = await imageService.generateAndPublishQRCode(
				`${PRODUCTION_URL}/product/${productId}`,
				`qrcode/products/${productId}.jpg`
			);
			productObj.qrCode = qrCodeString || "";
			productObj.expireTime = expireTime;
			productObj.image = imageUrl;

			const data = await appService.submitTransaction(
				"ManufactureProduct",
				userObj,
				productObj
			);

			productService.updateProductDB(productId, data);

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

	updateProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productObj = req.body.productObj;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await appService.submitTransaction(
				"UpdateProduct",
				userObj,
				productObj
			);

			productService.updateProductDB(productObj.productId, data);

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
