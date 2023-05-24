import { ProductModel } from "../../models/ProductModel";
import { Product, User } from "../../types/models";
import { getUserByUserId } from "./user";
import { contract, evaluateTransaction, evaluateTransactionUserObjProductId } from "../../app";
import { convertBufferToJavasciptObject } from "../../helpers";

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
}

export const getProductById = async (productId: string, userObj: User) => {
	const contractProduct = await contract(userObj);

	const productBuffer = await contractProduct.evaluateTransaction(
		"GetProduct",
		String(productId)
	);

	return convertBufferToJavasciptObject(productBuffer);

}

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
