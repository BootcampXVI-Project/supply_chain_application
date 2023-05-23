import { evaluateTransaction, evaluateTransactionUserObjProductId, submitTransaction } from "../../app";
import { Order, User } from "../../types/models";
import { convertBufferToJavasciptObject } from "../../helpers";

export default class OrderService {
	async getAllOrders(userObj: User) {
		const orderBuffer = await evaluateTransaction(
			"GetAllOrder",
			userObj,
			null
		);
		return convertBufferToJavasciptObject(orderBuffer);
	};

	async getOrder(userObj: User, orderId: string) {
		try {

			const orderBuffer = await evaluateTransactionUserObjProductId(
				"GetOrder",
				userObj,
				String(orderId)
			);
			return convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	async createOrder(userObj: any, orderObj: any) {
		return await submitTransaction("CreateOrder", userObj, orderObj);
	}
}