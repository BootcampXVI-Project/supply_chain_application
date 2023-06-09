import OrderService from "./orderService";
import { User } from "../models/UserModel";
import { getAllProducts } from "./productService";
import { Order } from "../models/OrderModel";
import { log } from "console";
import { UserModel } from "../models/UserModel";
import { Product, ProductIdItem } from "../types/models";
const orderService: OrderService = new OrderService();

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

export const getAllOrderedProducts = async (userObj: User) => {
	try {
		const orders: Order[] = await orderService.GetAllOrdersOfRetailer(
			userObj,
			userObj.userId,
			"SHIPPED"
		);

		type ProductNumber = {
			product: Product;
			count: number;
		};
		type OrderedProductId = Record<string, ProductNumber>;
		let orderedProductIds: OrderedProductId = {};

		orders.map((order) =>
			order.productItemList.map((productItem) => {
				const pId = productItem.product.productId;
				if (orderedProductIds[pId]) {
					orderedProductIds[pId].count = orderedProductIds[pId].count + 1;
				} else {
					orderedProductIds[pId] = {
						product: productItem.product,
						count: 1
					};
				}
			})
		);

		// Calculation ...
		const entries: [string, ProductNumber][] =
			Object.entries(orderedProductIds);
		entries.sort((a, b) => b[1].count - a[1].count);
		const result: ProductNumber[] = entries.map(([key, value]) => ({
			product: value.product,
			count: value.count
		}));

		return result;
	} catch (error) {
		console.log("getProductByRetailerId", error.message);
		return null;
	}
};

export const getPopularOrderedProducts = async (userObj: User) => {
	try {
		const orders: Order[] = await orderService.GetAllOrdersOfRetailer(
			userObj,
			userObj.userId,
			"SHIPPED"
		);

		type ProductNumber = {
			product: Product;
			count: number;
		};
		type OrderedProductId = Record<string, ProductNumber>;
		let orderedProductIds: OrderedProductId = {};

		orders.map((order) =>
			order.productItemList.map((productItem) => {
				const pId = productItem.product.productId;
				if (orderedProductIds[pId]) {
					orderedProductIds[pId].count = orderedProductIds[pId].count + 1;
				} else {
					orderedProductIds[pId] = {
						product: productItem.product,
						count: 1
					};
				}
			})
		);

		// Calculation ...
		const entries: [string, ProductNumber][] =
			Object.entries(orderedProductIds);
		entries.sort((a, b) => b[1].count - a[1].count);
		const top3Elements: [string, ProductNumber][] = entries.slice(0, 5);
		const result: ProductNumber[] = top3Elements.map(([key, value]) => ({
			product: value.product,
			count: value.count
		}));

		return result;
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
