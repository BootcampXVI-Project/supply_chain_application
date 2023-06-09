import OrderService from "./orderService";
import { User } from "../models/UserModel";
import { Order } from "../models/OrderModel";
import { UserModel } from "../models/UserModel";
import { getAllProducts } from "./productService";
import {
	ManufacturedProduct,
	OrderedProductId,
	Product,
	ProductIdItem,
	ProductNumber
} from "../types/models";

const orderService: OrderService = new OrderService();

export const getAllRetailerProducts = async (userId: string) => {
	try {
		const products = await getAllProducts(userId);
		let retailerProducts: Product[] = [];
		// for (let p of products) {
		// 	if (p.status.lowercase() == "retailer") {
		// 		retailerProducts.push(p);
		// 	}
		// }
		return retailerProducts;
	} catch (error) {
		console.log("getAllRetailerProducts", error.message);
		return null;
	}
};

export const getManufacturedProducts = async (userId: string) => {
	try {
		const products = await getAllProducts(userId);
		let manufacturedProducts: ManufacturedProduct[] = [];

		products.forEach((product: any) => {
			if (product.status == "MANUFACTURED") {
				manufacturedProducts.push({
					product: product,
					manufacturedDate: product.dates[3].time
				});
			}
		});

		const sortedProducts = manufacturedProducts.sort((a, b) =>
			b.manufacturedDate.localeCompare(a.manufacturedDate)
		);

		return sortedProducts;
	} catch (error) {
		console.log("getNewManufacturedProducts", error.message);
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
	} catch (error) {
		console.log("addCartByRetailerId", error.message);
		return null;
	}
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
	} catch (error) {
		console.log("updateCartByRetailerId", error.message);
		return null;
	}
};

export const deleteCart = async (userId: string) => {
	try {
		const deleted = await UserModel.findOneAndUpdate(
			{ userId: userId },
			{ cart: [] },
			{ new: true }
		);
		return deleted.cart;
	} catch (error) {
		console.log("deleteCart", error.message);
		return null;
	}
};
