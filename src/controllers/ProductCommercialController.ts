import AppService from "../appService";
import UserService from "../services/userService";
import ProductCommercialService from "../services/productCommercialService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { Product } from "../types/models";

const appService: AppService = new AppService();
const userService: UserService = new UserService();
const productCommercialService: ProductCommercialService =
	new ProductCommercialService();

const ProductCommercialController = {
	getTransactionHistory: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const productCommercialId = String(req.params.productCommercialId);
			const products = await productCommercialService.getTransactionHistory(
				user.userId,
				productCommercialId
			);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await productCommercialService.getAllProducts(
				user.userId
			);
			const sortedProducts = products.sort(
				(a: Product, b: Product) =>
					parseInt(a.productId.slice(17)) - parseInt(b.productId.slice(17))
			);

			return res.json({
				data: sortedProducts,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getProduct: async (req: Request, res: Response) => {
		try {
			const productCommercialId = String(req.params.productCommercialId);
			const product = await productCommercialService.getProductByIdNoAuth(
				productCommercialId
			);

			return res.json({
				data: product,
				message: "successfully",
				error: null
			});
		} catch (error) {
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productCommercialService.getProductById(
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
			if (productObj.status.toLowerCase() != "manufactured") {
				return res.json({
					data: null,
					message: "Product is not manufactured or was exported",
					error: "product-is-not-manufactured-or-was-exported"
				});
			}

			productObj.price = price;
			const data = await appService.submitTransaction(
				"ExportProduct",
				userObj,
				productObj
			);

			productCommercialService.updateProductDB(productId, data);

			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	distributeProduct: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productId = String(req.body.productId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productCommercialService.getProductById(
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

			if (productObj.status.toLowerCase() != "exported") {
				return res.json({
					data: null,
					message: "Product is not exported or was distributed",
					error: "product-is-not-exported-or-was-distributed"
				});
			}

			const data = await appService.submitTransaction(
				"DistributeProduct",
				userObj,
				productObj
			);

			productCommercialService.updateProductDB(productId, data);

			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productCommercialService.getProductById(
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
			if (productObj.status.toLowerCase() != "distributing") {
				return res.json({
					data: null,
					message: "Product is not distributed or was selling",
					error: "product-is-not-distributed-or-was-selling"
				});
			}

			productObj.price = price;
			const data = await appService.submitTransaction(
				"ImportRetailerProduct",
				userObj,
				productObj
			);

			productCommercialService.updateProductDB(productId, data);

			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const { productId, price } = req.body;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const productObj = await productCommercialService.getProductById(
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
			if (productObj.status.toLowerCase() != "retailing") {
				return res.json({
					data: null,
					message: "Product is not selling or was sold",
					error: "product-is-not-selling-or-was-sold"
				});
			}

			productObj.price = price;
			const data = await appService.submitTransaction(
				"SellProduct",
				userObj,
				productObj
			);

			productCommercialService.updateProductDB(productId, data);

			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default ProductCommercialController;
