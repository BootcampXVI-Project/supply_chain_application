import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { Product } from "../models/ProductModel";
import { getUserObjByUserId } from "../services/userService";
import {
	getProductById,
	getAllProducts
} from "../services/productCommercialService";

const ProductCommercialController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await getAllProducts(user.userId);
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
			const product = await getProductById(userObj, productId);

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
	}
};

export default ProductCommercialController;
