import { User } from "../types/models";
import { getUserByUserId } from "./userService";
import {
	evaluateGetWithNoArgs,
	evaluateTransactionUserObjProductId
} from "../app";

export const getAllProducts = async (userId: string) => {
	const userObj = await getUserByUserId(userId);
	const products = await evaluateGetWithNoArgs(
		"GetAllProductsCommercial",
		userObj
	);
	return products;
};

export const getProductById = async (userObj: User, productId: string) => {
	const product = await evaluateTransactionUserObjProductId(
		"GetProductCommercial",
		userObj,
		productId
	);
	return product;
};
