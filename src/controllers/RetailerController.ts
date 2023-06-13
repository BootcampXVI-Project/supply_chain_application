import UserService from "../services/userService";
import RetailerService from "../services/retailerService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { ProductIdItem } from "../types/models";

const userService: UserService = new UserService();
const retailerService: RetailerService = new RetailerService();

const RetailerController = {
	getManufacturedProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const products = await retailerService.getManufacturedProducts(
				user.userId
			);

			if (products == null) {
				return res.json({
					data: null,
					message: "This retailer don't have any product!",
					error: "empty-product"
				});
			} else {
				return res.json({
					data: products,
					message: "successfully",
					error: null
				});
			}
		} catch (error) {
			console.log("getAllOrderedProducts", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllOrderedProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);

			const products = await retailerService.getAllOrderedProducts(userObj);
			if (products == null) {
				return res.json({
					data: null,
					message: "This retailer don't have any product!",
					error: "empty-product"
				});
			} else {
				return res.json({
					data: products,
					message: "successfully",
					error: null
				});
			}
		} catch (error) {
			console.log("getAllOrderedProducts", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getPopularOrderedProducts: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const userObj = await userService.getUserObjByUserId(user.userId);

			const products = await retailerService.getPopularOrderedProducts(userObj);
			if (products == null) {
				return res.json({
					data: null,
					message: "This retailer don't have any product!",
					error: "empty-product"
				});
			}

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("getPopularOrderedProducts", error.message);
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
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const cart = await retailerService.getCartByRetailerId(user.userId);
			if (cart == null) {
				return res.json({
					data: null,
					message: "This retailer don't have any product!",
					status: "empty-product"
				});
			}

			return res.json({
				data: cart,
				message: "successfully",
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productObj = req.body.product as ProductIdItem;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const cart = await retailerService.getCartByRetailerId(user.userId);
			if (cart?.length === 0) {
				const order = await retailerService.addCartByRetailerId(
					user.userId,
					productObj
				);
				return res.json({
					data: order,
					message: "successfully",
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

				const order = await retailerService.updateCartByRetailerId(
					user.userId,
					cart
				);
				return res.json({
					data: order,
					message: "successfully",
					error: null
				});
			}
		} catch (error) {
			console.log("addCartByRetailerId", error.message);
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
			const userObj = await userService.getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const cart = await retailerService.deleteCart(user.userId);
			return res.json({
				data: cart,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("deleteCart", error.message);
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
			const userObj = await userService.getUserObjByUserId(user.userId);
			const productObj = req.body.product as ProductIdItem;

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const cart = await retailerService.getCartByRetailerId(user.userId);
			if (cart?.length === 0) {
				return res.json({
					data: null,
					message: "Cart is empty!",
					error: "empty-cart"
				});
			} else {
				const result = cart.filter(
					(product) => product.productId !== productObj.productId
				);
				const order = await retailerService.updateCartByRetailerId(
					user.userId,
					result
				);
				return res.json({
					data: order,
					message: "successfully",
					error: null
				});
			}
		} catch (error) {
			console.log("deteleProductInCart", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default RetailerController;
