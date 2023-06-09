import { contract } from "../app";
import { User, Product } from "../types/models";
import { getUserByUserId } from "./userService";
import { ProductModel } from "../models/ProductModel";

export const checkExistedProduct = async (productId: string) => {
	const isExisted = await ProductModel.exists({ productId: productId });
	return Boolean(isExisted);
};

export const getAllProducts = async (userId: string) => {
	const userObj = await getUserByUserId(userId);
	const contractOrder = await contract(userObj);
	const products = await contractOrder.evaluateTransaction("GetAllProducts");
	return products;
};

export const getProductById = async (productId: string, userObj: User) => {
	const contractProduct = await contract(userObj);
	const product = await contractProduct.evaluateTransaction(
		"GetProduct",
		productId
	);
	return product;
};

export const getDetailProductById = async (
	productId: string,
	userObj: User
) => {
	const contractProduct = await contract(userObj);
	const product = await contractProduct.evaluateTransaction(
		"GetProduct",
		productId
	);
	return product;
};

export const exportProduct = async (
	userObj: User,
	productId: string,
	price: string
) => {
	try {
		const productObj = await getProductById(productId, userObj);
		if (!productObj) {
			return {
				message: "Product not found!",
				status: "notfound"
			};
		}
		if (productObj.status.toLowerCase() != "manufactured") {
			return {
				message: "Product is not manufactured or was exported"
			};
		}

		productObj.price = price;

		const contractOrder = await contract(userObj);
		const product = await contractOrder.submitTransaction(
			"ExportProduct",
			JSON.stringify(userObj),
			JSON.stringify(productObj)
		);
		return product;
	} catch (error) {}
};

export const createProduct = async (productObj: Product) => {
	const isExistedProduct: boolean = await checkExistedProduct(
		productObj.productId
	);
	if (isExistedProduct) {
		return {
			data: null,
			message: "productid-existed"
		};
	}

	const createdProduct = await ProductModel.create(productObj)
		.then((data: any) => {
			console.log("success", data);
			return data;
		})
		.catch((error: any) => {
			console.log("error", error);
			return error;
		});

	if (createdProduct) {
		return { data: createdProduct, message: "successfully" };
	} else {
		return { data: createdProduct, message: "failed" };
	}
};
