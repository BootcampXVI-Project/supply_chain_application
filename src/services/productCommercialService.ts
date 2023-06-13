import AppService from "../services/appService";
import UserService from "./userService";
import { User } from "../types/models";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

class ProductCommercialService {
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
}

export default ProductCommercialService;
