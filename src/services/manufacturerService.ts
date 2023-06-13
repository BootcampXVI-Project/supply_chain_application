import { User } from "../models/UserModel";
import { submitTransactionOrderId } from "../app";

export default class ManufacturerService {
	async approveOrderRequest(userObj: User, orderId: string) {
		try {
			return await submitTransactionOrderId("ApproveOrder", userObj, orderId);
		} catch (error) {
			return error.message;
		}
	}

	async rejectOrderRequest(userObj: User, orderId: string) {
		try {
			return await submitTransactionOrderId("RejectOrder", userObj, orderId);
		} catch (error) {
			return error.message;
		}
	}
}
