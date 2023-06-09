import { User } from "../types/models";
import { CounterName } from "../types/types";
import { convertBufferToJavasciptObject } from "../helpers";
import {
	contract,
	submitTransaction,
	evaluateTransactionGetNextCounter
} from "../app";

export default class OrderService {
	async getNextCounterID(userObj: User, counterName: CounterName) {
		const counterBuffer = await evaluateTransactionGetNextCounter(
			"GetCounterOfType",
			userObj,
			counterName
		);
		const currentCounter = await convertBufferToJavasciptObject(counterBuffer);

		return counterName == "ProductCounterNO"
			? `Product${currentCounter + 1}`
			: `Order${currentCounter + 1}`;
	}

	async getAllOrders(userObj: User, status: string) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetAllOrders",
				status
			);
			return await convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			console.log(error.message);
			return error.message;
		}
	}

	async getAllOrdersByAddress(
		userObj: User,
		longitude: string,
		latitude: string,
		shippingStatus: string
	) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetAllOrdersByAddress",
				longitude,
				latitude,
				shippingStatus
			);
			return await convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			return error.message;
		}
	}

	async GetAllOrdersOfManufacturer(
		userObj: User,
		userId: string,
		status: string
	) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfManufacturer",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			return error.message;
		}
	}

	async GetAllOrdersOfDistributor(
		userObj: User,
		userId: string,
		status: string
	) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfDistributor",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			return error.message;
		}
	}

	async GetAllOrdersOfRetailer(userObj: User, userId: string, status: string) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfRetailer",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			return error.message;
		}
	}

	async getOrder(userObj: User, orderId: string) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetOrder",
				String(orderId)
			);
			return await convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			return error.message;
		}
	}

	async getDetailOrder(userObj: User, orderId: string) {
		try {
			const contractOrder = await contract(userObj);
			const orderBuffer = await contractOrder.evaluateTransaction(
				"GetOrder",
				orderId
			);
			return await convertBufferToJavasciptObject(orderBuffer);
		} catch (error) {
			return error.message;
		}
	}

	async createOrder(userObj: any, orderObj: any) {
		try {
			return await submitTransaction("CreateOrder", userObj, orderObj);
		} catch (error) {
			return error.message;
		}
	}

	async updateOrder(userObj: any, orderObj: any) {
		try {
			return await submitTransaction("UpdateOrder", userObj, orderObj);
		} catch (error) {
			return error.message;
		}
	}

	async finishOrder(userObj: any, orderObj: any) {
		try {
			return await submitTransaction("FinishOrder", userObj, orderObj);
		} catch (error) {
			return error.message;
		}
	}

	async getHistoryOrder(userObj: any, orderId: any) {
		try {
			const contractOrder = await contract(userObj);
			return await contractOrder.evaluateTransaction(
				"GetHistoryOrder",
				orderId
			);
		} catch (error) {
			return error.message;
		}
	}
}
