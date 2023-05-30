import qrCode from "qrcode";
import ImageService from "../services/imageService";
import { Request, Response } from "express";
import { PRODUCTION_URL } from "../constants";
import { getUserByUserId } from "../services/userService";
import { getProductById } from "../services/productService";
import { convertBufferToJavasciptObject } from "../helpers";
import { evaluateTransaction, submitTransaction } from "../app";

const imageService: ImageService = new ImageService();

const ProductController = {
	getProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId } = req.query;
			const userObj = await getUserByUserId(String(userId));
			const product = await getProductById(String(productId), userObj);

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
			const productsBuffer = await evaluateTransaction(
				"GetAllProducts",
				null,
				null
			);
			const products = convertBufferToJavasciptObject(productsBuffer);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("Err", error);
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
			const productObj = await getProductById(productId, userObj);

			const transactionsBuffer = await evaluateTransaction(
				"GetHistory",
				userObj,
				productObj
			);
			const transactions = convertBufferToJavasciptObject(transactionsBuffer);

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
			const { userId, productObj } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "supplier") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const data = await submitTransaction(
				"CultivateProduct",
				userObj,
				productObj
			);

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
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("cultivateProduct", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	harvestProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId } = req.body;

			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "supplier") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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
			console.log("harvestProduct", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	updateProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "supplier") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

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

	importProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, price } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "manufacturer") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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
			console.log("importProduct", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	manufactureProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, imageUrl } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "user-notfound"
				});
			}
			if (userObj.role.toLowerCase() != "manufacturer") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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

			// Upload image onto Firebase Storage
			// const imageArray = imageUrl;
			// let imageUrls = [];
			// for (let i of imageArray) {
			// 	const uploadedImageUrl =
			// 		(await imageService.upload(
			// 			i,
			// 			"product_images/" + productObj.productName + "/" + Date.now()
			// 		)) + ".jpg";
			// 	imageUrls.push(uploadedImageUrl);
			// }
			// productObj.image = imageUrls;

			// Generate QR code for product
			const qrCodeString = await qrCode.toDataURL(
				`${PRODUCTION_URL}/product/detail?productId=${productId}&userId=${userId}`
			);
			productObj.qrCode = qrCodeString;

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
			console.log("manufacturer1", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	exportProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, price } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "manufacturer") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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
			console.log("export", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	distributeProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "distributor") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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
			console.log(" Distribute", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	importRetailerProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, price } = req.body;

			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "retailer") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	sellProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, price } = req.body;
			const userObj = await getUserByUserId(userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "retailer") {
				return res.json({
					message: "Denied permission!",
					status: "unauthorize"
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

			const data = await submitTransaction("SellProduct", userObj, productObj);
			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			return res.json({
				message: "failed",
				status: "failed"
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
	}
};

export default ProductController;
