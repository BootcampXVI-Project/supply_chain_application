import { ProductModel } from "../../models/ProductModel";
import { Product } from "../../types/models";

export const checkExistedProduct = async (ProductId: string) => {
	const isExisted = await ProductModel.exists({ ProductId: ProductId });
	return Boolean(isExisted);
};

export const getProductByProductId = async (ProductId: string) => {
	return await ProductModel.findOne({ ProductId: ProductId })
		.select("-__v -_id -createdAt -updatedAt")
		.lean();
};

export const createProduct = async (userId: string, productObj: Product) => {
	const isExistedProduct: boolean = await checkExistedProduct(
		productObj.ProductId
	);
	if (isExistedProduct) {
		return {
			data: null,
			message: "productid-existed"
		};
	}

	// Update Cultivated status & date and SupplierId
	productObj.Status = "CULTIVATING";
	productObj.Dates.Cultivated = new Date().toString();
	productObj.Actors.SupplierId = userId;

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
