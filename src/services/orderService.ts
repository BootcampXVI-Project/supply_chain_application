import { User } from "../types/models";
import { contract, submitTransaction } from "../app";
import { convertBufferToJavasciptObject } from "../helpers";

export default class OrderService {
	async getAllOrders(userObj: User) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetAllOrders"
			);
			return convertBufferToJavasciptObject(orderBuffer);
		} catch (e) {
			console.error(e);
		}
	}

	async getOrder(userObj: User, orderId: string) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetOrder",
				String(orderId)
			);
			return convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			console.error(error);
		}
	}

	async createOrder(userObj: any, orderObj: any) {
		try {
			return await submitTransaction("CreateOrder", userObj, orderObj);
		} catch (e) {
			console.error(e);
		}
	}

	async updateOrder(userObj: any, orderObj: any) {
		try {
			return await submitTransaction("UpdateOrder", userObj, orderObj);
		} catch (e) {
			console.error(e);
		}
	}

	async finishOrder(userObj: any, orderObj: any) {
		try {
			return await submitTransaction("FinishOrder", userObj, orderObj);
		} catch (e) {
			console.error(e);
		}
	}

	async getHistoryOrder(userObj: any, orderId: any) {
		try {
			const contractOrder = await contract(userObj);
			return await contractOrder.evaluateTransaction(
				"GetHistoryOrder",
				orderId
			);
		} catch (e) {
			console.error(e);
		}
	}
}
