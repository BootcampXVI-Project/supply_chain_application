import AppService from "../appService";
import UserService from "./userService";
import { User, Product, ProductForUpdate } from "../types/models";
import { ProductModel } from "../models/ProductModel";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

class ProductService {
	checkExistedProduct = async (productId: string) => {
		const isExisted = await ProductModel.exists({ productId: productId });
		return Boolean(isExisted);
	};

	getTransactionHistory = async (userId: string, productId: string) => {
		const userObj = await userService.getUserByUserId(userId);
		const products = await appService.evaluateTransactionProductId(
			"GetProductTransactionHistory",
			userObj,
			productId
		);
		return products;
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

	handleProductForUpdate = async (
		userObj: User,
		productObj: ProductForUpdate
	) => {
		const product: Product = await this.getProductById(
			userObj,
			productObj.productId
		);
		const updateProduct = { ...product, ...productObj };
		return updateProduct;
	};

	createProductDB = async (product: Product) => {
		ProductModel.create(product)
			.then((data: any) => {
				console.log("Backup success!");
				return data;
			})
			.catch((error: any) => {
				console.log("Backup error!", error.message);
				return null;
			});
	};

	updateProductDB = async (productId: string, product: Product) => {
		ProductModel.findOneAndUpdate({ productId }, product)
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

export default ProductService;
