import { getUserByUserId } from "./userService";
import { Product, User } from "../types/models";
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
	return convertBufferToJavasciptObject(counterBuffer);
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
	const productsBuffer = await evaluateTransaction(
		"GetAllProducts",
		userObj,
		null
	);
	return convertBufferToJavasciptObject(productsBuffer);
};

export const getProductById = async (productId: string, userObj: User) => {
	const contractProduct = await contract(userObj);

	const productBuffer = await contractProduct.evaluateTransaction(
		"GetProduct",
		String(productId)
	);

	return convertBufferToJavasciptObject(productBuffer);
};

export const createProduct = async (userId: string, productObj: Product) => {
	const isExistedProduct: boolean = await checkExistedProduct(
		productObj.productId
	);
	if (isExistedProduct) {
		return {
			data: null,
			message: "productid-existed"
		};
	}

	// Update Cultivated status & date and SupplierId
	productObj.status = "CULTIVATING";
	productObj.dates.cultivated = new Date().toString();
	productObj.actors.supplierId = userId;

	const createdProduct = await ProductModel.create(productObj)
		.then((data: any) => {
			console.log("success", data);
			return data;
		})
		.catch((error: any) => {
			console.log("error", error);
			return error;
		});

	console.log("createdProduct", createdProduct);

	if (createdProduct) {
		return { data: createdProduct, message: "successfully" };
	} else {
		return { data: createdProduct, message: "failed" };
	}
};
