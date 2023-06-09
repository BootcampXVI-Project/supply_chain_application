import { UserModel } from "../models/UserModel";
import { Product, ProductIdItem } from "../types/models";
import { getAllProducts } from "./productService";

export const getAllRetailerProducts = async (userId: string) => {
	try {
		const products = await getAllProducts(userId);
		let retailerProducts: Product[] = [];
		for (let p of products) {
			if (p.status.lowercase() == "retailer") {
				retailerProducts.push(p);
			}
		}
		return retailerProducts;
	} catch (error) {
		console.log("getAllRetailerProducts", error.message);
		return null;
	}
};

export const getProductsByRetailerId = async (userId: string) => {
	try {
		const products = await getAllRetailerProducts(userId);
		let retailerProducts: Product[] = [];

		// for (let product of products) {
		// 	if (product.actors.manufacturerId.toString() === userId.toString()) {
		// 		retailerProducts.push(product);
		// 	}
		// }
		return retailerProducts;
	} catch (error) {
		console.log("getProductByRetailerId", error.message);
		return null;
	}
};

export const getCartByRetailerId = async (userId: string) => {
	try {
		const user = await UserModel.findOne({ userId: userId });
		return user.cart;
	} catch (error) {
		console.log("getProductByRetailerId", error.message);
		return null;
	}
};
export const addCartByRetailerId = async (
	userId: string,
	cartObj: ProductIdItem
) => {
	try {
		const user = await UserModel.findOneAndUpdate(
			{ userId: userId },
			{ cart: [cartObj] },
			{ new: true }
		);
		return user.cart;
	} catch (error) {}
};

export const updateCartByRetailerId = async (
	userId: string,
	cartObj: ProductIdItem[]
) => {
	try {
		const user = await UserModel.findOneAndUpdate(
			{ userId: userId },
			{ cart: cartObj },
			{ new: true }
		);
		return user.cart;
	} catch (error) {}
};

export const deleteCart = async (userId: string) => {
	try {
		const deleted = await UserModel.findOneAndUpdate(
			{ userId: userId },
			{ cart: [] },
			{ new: true }
		);
		return deleted.cart;
	} catch (error) {}
};
