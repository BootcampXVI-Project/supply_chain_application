import AppService from "../appService";
import ImageService from "../services/imageService";
import UserService from "../services/userService";
import ProductService from "../services/productService";
import { Request, Response } from "express";
import { PRODUCTION_URL } from "../constants";
import { generateProductCode } from "../helpers";
import { DecodeUser, Product, ProductForCultivate } from "../types/models";

const appService: AppService = new AppService();
const imageService: ImageService = new ImageService();
const userService: UserService = new UserService();
const productService: ProductService = new ProductService();

const ProductController = {
	getTransactionHistory: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productId = String(req.params.productId);
			const products = await productService.getTransactionHistory(
				user.userId,
				productId
			);

			return res.status(200).json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await productService.getAllProducts(user.userId);
			const sortedProducts = products.sort(
				(a: Product, b: Product) =>
					parseInt(a.productId.slice(7)) - parseInt(b.productId.slice(7))
			);

			return res.status(200).json({
				data: sortedProducts,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getProduct: async (req: Request, res: Response) => {
		try {
			const productId = String(req.params.productId);
			const product = await productService.getProductByIdNoAuth(productId);

			return res.status(200).json({
				data: product,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
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

			return res.status(200).json({
				data: transactions,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
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
			productObj.productCode = generateProductCode(
				productObj.productName,
				userObj.userCode
			);

			if (!userObj) {
				return res.status(404).json({
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

			return res.status(200).json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	harvestProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productId = String(req.body.productId);

			if (!userObj) {
				return res.status(404).json({
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
				return res.status(404).json({
					data: null,
					message: "Product not found!",
					error: "product-notfound"
				});
			}

			if (productObj.status.toLowerCase() != "cultivated") {
				return res.status(400).json({
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

			return res.status(200).json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			return res.status(400).json({
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
				return res.status(404).json({
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
				return res.status(404).json({
					data: null,
					message: "Product not found!",
					error: "product-notfound"
				});
			}
			if (productObj.status.toLowerCase() != "harvested") {
				return res.status(400).json({
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

			return res.status(200).json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
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
				return res.status(404).json({
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
				return res.status(404).json({
					data: null,
					message: "Product not found!",
					error: "product-notfound"
				});
			}
			if (productObj.status.toLowerCase() != "imported") {
				return res.status(400).json({
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

			return res.status(200).json({
				data: data,
				message: "successfully",
				status: "success"
			});
		} catch (error) {
			return res.status(400).json({
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
				return res.status(404).json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const product = await productService.handleProductForUpdate(
				userObj,
				productObj
			);
			const data = await appService.submitTransaction(
				"UpdateProduct",
				userObj,
				product
			);

			productService.updateProductDB(productObj.productId, data);

			return res.status(200).json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default ProductController;
