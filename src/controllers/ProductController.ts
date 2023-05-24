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
	createProduct, getProductById
} from "../services/crudDatabase/product";
import { ObjectId } from "../constants";
import { log } from "console";

const imageService: ImageService = new ImageService();

const ProductController = {
	getProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId } = req.body;
			// const userId = String(req.body.userId);
			// const productId = String(req.query.productId);
			const userObj = await getUserByUserId(userId);

			const product = await getProductById(productId, userObj);

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
			const userId = String(req.body.userId);
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
			const productObj = await getProductById(productId, userObj);
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
			const { userId, productObj } = req.body;
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;

			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role.toLowerCase() != "supplier") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const data = await submitTransaction("CultivateProduct", userObj, productObj);

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
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "supplier") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "cultivated") {
				res.json({
					message: "Product is not cultivated or was harvested"
				});
			}

			const data = await submitTransaction("HarvestProduct", userObj, productObj);

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
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "supplier") {
				res.json({
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
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "manufacturer") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "harvested") {
				res.json({
					message: "Product is not harvested or was imported"
				});
			}

			productObj.price = price;
			const data = await submitTransaction("ImportProduct", userObj, productObj);

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
			// const imageUrl = req.body.imageUrl;
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "manufacturer") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "imported") {
				res.json({
					message: "Product is not imported or was manufactured"
				});
			}
			const imageArray = imageUrl;
			let imageUrls = [];

			for (let i of imageArray) {
				const uploadedImageUrl = (await imageService.upload( i, "image product/" + productObj.productName + "/" + Date.now() )) + ".jpg";
				imageUrls.push(uploadedImageUrl);
			}
			productObj.image = imageUrls;
			const data = await submitTransaction("ManufactureProduct", userObj, productObj);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("manufacturer", error);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	},

	exportProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, price } = req.body;
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "manufacturer") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "manufactured") {
				res.json({
					message: "Product is not manufactured or was exported"
				});
			}

			productObj.price = price;
			const data = await submitTransaction("ExportProduct", userObj, productObj);

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
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "distributor") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "exported") {
				res.json({
					message: "Product is not exported or was distributed"
				});
			}

			const data = await submitTransaction("DistributeProduct", userObj, productObj);

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

	sellProduct: async (req: Request, res: Response) => {
		try {
			const { userId, productId, price } = req.body;
			// const userId = String(req.body.userId);
			// const productObj = req.body.productObj;
			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				res.json({
					message: "User not found!",
					status: "notfound"
				});
			}

			if (userObj.role.toLowerCase() != "retailer") {
				res.json({
					message: "Denied permission!",
					status: "unauthorize"
				});
			}

			const productObj = await getProductById(productId, userObj);
			if (!productObj) {
				res.json({
					message: "Product not found!",
					status: "notfound"
				});
			}

			if (productObj.status.toLowerCase() != "selling") {
				res.json({
					message: "Product is not distributed or was sold"
				});
			}
			const data = await submitTransaction("SellProduct", userObj, productObj);

			return res.json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			console.log("sellproduct", error);
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
	},

	// createOrder: async (req: Request, res: Response) => {
	// 	try {
	// 		const { userId, orderObj } = req.body;
	// 		// const userId = String(req.body.userId);
	// 		// const orderObj = req.body.orderObj;
	// 		const userObj = await getUserByUserId(userId);
	// 		if (!userObj) {
	// 			res.json({
	// 				message: "User not found!",
	// 				status: "notfound"
	// 			});
	// 		}
	//
	// 		if (userObj.role.toLowerCase() != "distributor") {
	// 			res.json({
	// 				message: "Denied permission!",
	// 				status: "unauthorize"
	// 			});
	// 		}
	//
	// 		const data = await submitTransaction("CreateOrder", userObj, orderObj);
	//
	// 		return res.json({
	// 			data: data,
	// 			message: "successfully",
	// 			status: "success"
	// 		});
	//
	// 	} catch (error) {
	// 		console.log("createOrder", error);
	// 		return res.json({
	// 			message: "failed",
	// 			status: "failed"
	// 		});
	// 	}
	// },

	// updateOrder: async (req: Request, res: Response) => {
	// 	try {
	// 		const { userId, orderId } = req.body;
	// 		// const userId = String(req.body.userId);
	// 		// const orderObj = req.body.orderObj;
	// 		const userObj = await getUserByUserId(userId);
	// 		if (!userObj) {
	// 			res.json({
	// 				message: "User not found!",
	// 				status: "notfound"
	// 			})
	// 		}
	//
	// 		if (userObj.role.toLowerCase() != "supplier") {
	// 			res.json({
	// 				message: "Denied permission!",
	// 				status: "unauthorize"
	// 			})
	// 		}
	//
	// 		let order = await
	// 		// const orderObj = await
	// 		// console.log(userId);
	// 		// console.log(userObj);
	// 		//
	// 		// await submitTransaction("UpdateOrder", userObj, orderObj);
	//
	// 		return res.json({
	// 			data: null,
	// 			message: "successfully",
	// 			error: null
	// 		});
	// 	} catch (error) {
	// 		return res.json({
	// 			data: null,
	// 			message: "failed",
	// 			error: error
	// 		});
	// 	}
	// },
	//
	// finishOrder: async (req: Request, res: Response) => {
	// 	try {
	// 		const userId = String(req.body.userId);
	// 		const orderObj = req.body.orderObj;
	// 		const userObj = await getUserByUserId(userId);
	//
	// 		console.log(userId);
	// 		console.log(userObj);
	//
	// 		await submitTransaction("FinishOrder", userObj, orderObj);
	//
	// 		return res.json({
	// 			data: null,
	// 			message: "successfully",
	// 			error: null
	// 		});
	// 	} catch (error) {
	// 		return res.json({
	// 			data: null,
	// 			message: "failed",
	// 			error: error
	// 		});
	// 	}
	// }
};

export default ProductController;
