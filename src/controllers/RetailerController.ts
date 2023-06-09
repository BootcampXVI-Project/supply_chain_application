import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { getUserObjByUserId } from "../services/userService";
import {
	addCartByRetailerId,
	deleteCart,
	getCartByRetailerId,
	getProductsByRetailerId,
	updateCartByRetailerId
} from "../services/retailerService";
import { CartForCreate, ProductIdItem } from "../types/models";

const RetailerController = {
	getAllRetailerProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}

			const products = await getProductsByRetailerId(user.userId);
			if (products == null) {
				return res.json({
					message: "This retailer don't have any product!",
					status: "notfound"
				});
			}

			return res.json({
				data: products,
				message: "successful",
				error: null
			});
		} catch (error) {
			console.log("getAllRetailerProducts", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getCart: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}

			const cart = await getCartByRetailerId(user.userId);
			if (cart == null) {
				return res.json({
					message: "This retailer don't have any product!",
					status: "notfound"
				});
			}

			return res.json({
				data: cart,
				message: "successful",
				error: null
			});
		} catch (error) {
			console.log("getCartByRetailerId", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	addCart: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const productObj = req.body.product as ProductIdItem;
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}

			const cart = await getCartByRetailerId(user.userId);

			if (cart?.length === 0) {
				const order = await addCartByRetailerId(user.userId, productObj);
				return res.json({
					data: order,
					message: "successful",
					error: null
				});
			} else {
				const found = cart.find(
					(product) => product.productId === productObj.productId
				);

				if (found) {
					found.quantity = String(
						Number(found.quantity) + Number(productObj.quantity)
					);
				} else {
					cart.push(productObj);
				}
				const order = await updateCartByRetailerId(user.userId, cart);
				return res.json({
					data: order,
					message: "successful",
					error: null
				});
			}
		} catch (error) {
			console.log("getCartByRetailerId", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	deteleCart: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}

			const cart = await deleteCart(user.userId);

			return res.json({
				data: cart,
				message: "successful",
				error: null
			});
		} catch (error) {
			console.log("getCartByRetailerId", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	deteleProductInCart: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await getUserObjByUserId(user.userId);
			const productObj = req.body.product as ProductIdItem;
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "undefined"
				});
			}

			const cart = await getCartByRetailerId(user.userId);

			if (cart?.length === 0) {
				return res.json({
					data: null,
					message: "Cart is empty!",
					error: null
				});
			} else {
				const result = cart.filter(
					(product) => product.productId !== productObj.productId
				);
				const order = await updateCartByRetailerId(user.userId, result);
				return res.json({
					data: order,
					message: "successful",
					error: null
				});
			}
		} catch (error) {
			console.log("getCartByRetailerId", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default RetailerController;
