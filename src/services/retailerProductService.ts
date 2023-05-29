import { ProductModel } from "../models/ProductModel";
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
	} catch (e) {
		console.log("BUG", e);
		return null;
	}
};

export const getProductByRetailerId = async (userId: string) => {
	try {
		const products = await getAllRetailerProducts(userId);
		let retailerProducts: Product[] = [];
		for (let p of products) {
			if (p.actors.manufacturerId.toString() === userId.toString()) {
				retailerProducts.push(p);
			}
		}
		return retailerProducts;
	} catch (e) {
		console.log("BUG", e);
		return null;
	}
};
