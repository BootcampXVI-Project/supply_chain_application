import AppService from "../appService";
import UserService from "./userService";
import { User, ProductCommercial } from "../types/models";
import { ProductCommercialModel } from "../models/ProductCommercialModel";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

class ProductCommercialService {
	getTransactionHistory = async (userId: string, productId: string) => {
		const userObj = await userService.getUserByUserId(userId);
		const products = await appService.evaluateTransactionProductId(
			"GetProductCommercialTransactionHistory",
			userObj,
			productId
		);
		return products;
	};

	getAllProducts = async (userId: string) => {
		const userObj = await userService.getUserByUserId(userId);
		const products = await appService.evaluateGetWithNoArgs(
			"GetAllProductsCommercial",
			userObj
		);
		return products;
	};

	getProductById = async (userObj: User, productId: string) => {
		const product = await appService.evaluateTransactionUserObjProductId(
			"GetProductCommercial",
			userObj,
			productId
		);
		return product;
	};

	createProductDB = async (productCommercial: ProductCommercial) => {
		ProductCommercialModel.create(productCommercial)
			.then((data: any) => {
				console.log("Backup success!");
				return data;
			})
			.catch((error: any) => {
				console.log("Backup error!", error.message);
				return null;
			});
	};

	updateProductDB = async (
		productCommercialId: string,
		productCommercial: ProductCommercial
	) => {
		ProductCommercialModel.findOneAndUpdate(
			{ productCommercialId },
			productCommercial
		)
			.then((data: any) => {
				console.log("Backup success!");
				return data;
			})
			.catch((error: any) => {
				console.log("Backup error!", error.message);
				return null;
			});
	};
}

export default ProductCommercialService;
