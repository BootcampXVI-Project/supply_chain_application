import AppService from "../services/appService";
import UserService from "./userService";
import { User, Product } from "../types/models";
import { ProductModel } from "../models/ProductModel";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

class ProductService {
	checkExistedProduct = async (productId: string) => {
		const isExisted = await ProductModel.exists({ productId: productId });
		return Boolean(isExisted);
	};

	getAllProducts = async (userId: string) => {
		const userObj = await userService.getUserByUserId(userId);
		const products = await appService.evaluateGetWithNoArgs(
			"GetAllProducts",
			userObj
		);
		return products;
	};

	getProductById = async (userObj: User, productId: string) => {
		const product = await appService.evaluateTransactionUserObjProductId(
			"GetProduct",
			userObj,
			productId
		);
		return product;
	};

	createProductDB = async (productObj: Product) => {
		ProductModel.create(productObj)
			.then((data: any) => {
				console.log("Backup success!", data);
				return data;
			})
			.catch((error: any) => {
				console.log("Backup error!", error);
				return error;
			});
	};

	updateProductDB = async (productId: string, productObj: Product) => {
		ProductModel.findOneAndUpdate({ productId }, productObj)
			.then((data: any) => {
				console.log("Backup success!", data);
				return data;
			})
			.catch((error: any) => {
				console.log("Backup error!", error);
				return error;
			});
	};
}

export default ProductService;
