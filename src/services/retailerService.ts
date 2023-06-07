import { Product } from "../types/models";
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
