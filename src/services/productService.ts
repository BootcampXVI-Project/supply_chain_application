import { User, Product } from "../types/models";
import { getUserByUserId } from "./userService";
import { ProductModel } from "../models/ProductModel";
import {
	evaluateGetWithNoArgs,
	evaluateTransactionUserObjProductId
} from "../app";

export const checkExistedProduct = async (productId: string) => {
	const isExisted = await ProductModel.exists({ productId: productId });
	return Boolean(isExisted);
};

export const getAllProducts = async (userId: string) => {
	const userObj = await getUserByUserId(userId);
	const products = await evaluateGetWithNoArgs("GetAllProducts", userObj);
	return products;
};

export const getProductById = async (userObj: User, productId: string) => {
	const product = await evaluateTransactionUserObjProductId(
		"GetProduct",
		userObj,
		productId
	);
	return product;
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
