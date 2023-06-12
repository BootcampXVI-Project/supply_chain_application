import ImageService from "./imageService";
import { CounterName } from "../types/types";
import { PRODUCTION_URL } from "../constants";
import { convertBufferToJavasciptObject } from "../helpers";
import { OrderForCreate, OrderPayloadForCreate, User } from "../types/models";
import {
	contract,
	submitTransaction,
	evaluateTransactionGetNextCounter,
	submitTransactionCreateOrder
} from "../app";

const imageService: ImageService = new ImageService();

export default class OrderService {
	async getNextCounter(userObj: User, counterName: CounterName) {
		const currentCounter = await evaluateTransactionGetNextCounter(
			"GetCounterOfType",
			userObj,
			counterName
		);
		const nextCounter = currentCounter + 1;
		return nextCounter;
	}

	async getNextCounterID(userObj: User, counterName: CounterName) {
		const currentCounter = await evaluateTransactionGetNextCounter(
			"GetCounterOfType",
			userObj,
			counterName
		);
		return counterName == "ProductCounterNO"
			? `Product${currentCounter + 1}`
			: `Order${currentCounter + 1}`;
	}

	async getAllOrders(userObj: User, status: string) {
		try {
			const contractOrder = await contract(userObj);
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrders",
				status
			);
			return convertBufferToJavasciptObject(orders);
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
			const order = await contractOrder.evaluateTransaction(
				"GetAllOrdersByAddress",
				longitude,
				latitude,
				shippingStatus
			);
			return convertBufferToJavasciptObject(order);
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
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfManufacturer",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orders);
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
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfDistributor",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orders);
		} catch (error) {
			return error.message;
		}
	}

	async GetAllOrdersOfRetailer(userObj: User, userId: string, status: string) {
		try {
			const contractOrder = await contract(userObj);
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfRetailer",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orders);
		} catch (error) {
			return error.message;
		}
	}

	async getOrder(userObj: User, orderId: string) {
		try {
			const contractOrder = await contract(userObj);
			const order = await contractOrder.evaluateTransaction(
				"GetOrder",
				String(orderId)
			);
			return convertBufferToJavasciptObject(order);
		} catch (error) {
			return error.message;
		}
	}

	async getDetailOrder(userObj: User, orderId: string) {
		try {
			const contractOrder = await contract(userObj);
			const order = await contractOrder.evaluateTransaction(
				"GetOrder",
				orderId
			);
			return convertBufferToJavasciptObject(order);
		} catch (error) {
			return error.message;
		}
	}

	async createOrder(userObj: User, orderObj: OrderForCreate) {
		try {
			return await submitTransactionCreateOrder(
				"CreateOrder",
				userObj,
				orderObj
			);
		} catch (error) {
			return error.message;
		}
	}

	async updateOrder(userObj: User, orderObj: any) {
		try {
			return await submitTransaction("UpdateOrder", userObj, orderObj);
		} catch (error) {
			return error.message;
		}
	}

	async finishOrder(userObj: User, orderObj: any) {
		try {
			return await submitTransaction("FinishOrder", userObj, orderObj);
		} catch (error) {
			return error.message;
		}
	}

	async getHistoryOrder(userObj: User, orderId: string) {
		try {
			const contractOrder = await contract(userObj);
			const data = await contractOrder.evaluateTransaction(
				"GetHistoryOrder",
				orderId
			);
			return convertBufferToJavasciptObject(data);
		} catch (error) {
			return error.message;
		}
	}

	async handleOrderPayloadForCreateToOrderForCreate(
		userObj: User,
		orderObj: OrderPayloadForCreate
	) {
		const productCommercialCounter = await this.getNextCounter(
			userObj,
			"ProductCommercialCounterNO"
		);

		const order: OrderForCreate = {
			productIdQRCodeItems: await Promise.all(
				orderObj.productIdItems.map(async (productIdItem, index) => {
					// QR Code for each product commercial
					const productCommercialId = `ProductCommercial${
						productCommercialCounter + index
					}`;
					const qrCodeString = await imageService.generateAndPublishQRCode(
						`${PRODUCTION_URL}/product-commercial/${productCommercialId}`,
						`qrcode/product-commercials/${productCommercialId}.jpg`
					);
					return { ...productIdItem, qrCode: `qrCodeString || ""` };
				})
			),
			deliveryStatus: orderObj.deliveryStatus,
			signatures: orderObj.signatures,
			qrCode: orderObj.qrCode
		};

		return order;
	}
}
