import AppService from "../appService";
import UserService from "../services/userService";
import ProductService from "../services/productService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { Product } from "../types/models";

const appService: AppService = new AppService();
const userService: UserService = new UserService();
const productService: ProductService = new ProductService();

const SupplierController = {
	getProductsBySupplierId: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await productService.getAllProducts(user.userId);

			let productList = [];
			for (let product of products) {
				console.log("SUPPLIER", product);
				if (product.supplier == user.userId) {
					productList.push(product);
				}
			}
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
			const productObj = req.body.productObj;
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await appService.submitTransaction(
				"SupplierUpdateProduct",
				userObj,
				productObj
			);
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

export default SupplierController;
