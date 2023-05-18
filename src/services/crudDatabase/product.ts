import { ProductModel } from "../../models/ProductModel";
import { Product } from "../../types/models";

export const checkExistedProduct = async (productId: string) => {
	const isExisted = await ProductModel.exists({ productId: productId });
	return Boolean(isExisted);
};

export const getProductByProductId = async (productId: string) => {
	return await ProductModel.findOne({ productId: productId })
		.select("-__v -_id -createdAt -updatedAt")
		.lean();
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
