import { getUserByUserId } from "./userService";
import { Product, ProductForCultivate, User } from "../types/models";
import { ProductModel } from "../models/ProductModel";
import { convertBufferToJavasciptObject } from "../helpers";
import {
	contract,
	evaluateTransaction,
	evaluateTransactionUserObjCounterName
} from "../app";

export const getCounter = async (userId: string, counterName: string) => {
	// counterName: "ProductCounterNO" || "OrderCounterNO"
	const userObj = await getUserByUserId(userId);
	const counterBuffer = await evaluateTransactionUserObjCounterName(
		"getCounter",
		userObj,
		counterName
	);
	return await convertBufferToJavasciptObject(counterBuffer);
};

export const getNextCounterID = async (userId: string, counterName: string) => {
	const counterID = await getCounter(userId, counterName);
	return counterName == "ProductCounterNO"
		? `Product${counterID + 1}`
		: `Order${counterID + 1}`;
};

export const checkExistedProduct = async (productId: string) => {
	const isExisted = await ProductModel.exists({ productId: productId });
	return Boolean(isExisted);
};

export const getAllProducts = async (userId: string) => {
	const userObj = await getUserByUserId(userId);
	const contractOrder = await contract(userObj);
	const productsBuffer = await contractOrder.evaluateTransaction(
		"GetAllProducts"
	);
	return await convertBufferToJavasciptObject(productsBuffer);
};

export const getProductById = async (productId: string, userObj: User) => {
	const contractProduct = await contract(userObj);
	const productBuffer = await contractProduct.evaluateTransaction(
		"GetProduct",
		productId
	);
	return await convertBufferToJavasciptObject(productBuffer);
};

export const getDetailProductById = async (
	productId: string,
	userObj: User
) => {
	const contractProduct = await contract(userObj);
	const productBuffer = await contractProduct.evaluateTransaction(
		"GetProduct",
		productId
	);
	return await convertBufferToJavasciptObject(productBuffer);
};

export const cultivateProduct = async (
	userObj: User,
	productObj: ProductForCultivate
) => {
	const contractOrder = await contract(userObj);
	const productBuffer = await contractOrder.submitTransaction(
		"CultivateProduct",
		JSON.stringify(userObj),
		JSON.stringify(productObj)
	);
	return await convertBufferToJavasciptObject(productBuffer);
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
