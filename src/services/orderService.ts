import AppService from "../services/appService";
import ImageService from "./imageService";
import { CounterName } from "../types/types";
import { PRODUCTION_URL } from "../constants";
import { convertBufferToJavasciptObject } from "../helpers";
import { OrderForCreate, OrderPayloadForCreate, User } from "../types/models";

const appService: AppService = new AppService();
const imageService: ImageService = new ImageService();

class OrderService {
	getNextCounter = async (userObj: User, counterName: CounterName) => {
		const currentCounter = await appService.evaluateTransactionGetNextCounter(
			"GetCounterOfType",
			userObj,
			counterName
		);
		const nextCounter = currentCounter + 1;
		return nextCounter;
	};

	getNextCounterID = async (userObj: User, counterName: CounterName) => {
		const currentCounter = await appService.evaluateTransactionGetNextCounter(
			"GetCounterOfType",
			userObj,
			counterName
		);
		return counterName == "ProductCounterNO"
			? `Product${currentCounter + 1}`
			: `Order${currentCounter + 1}`;
	};

	getAllOrders = async (userObj: User, status: string) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrders",
				status
			);
			return convertBufferToJavasciptObject(orders);
		} catch (error) {
			console.log(error.message);
			return error.message;
		}
	};

	getAllOrdersByAddress = async (
		userObj: User,
		longitude: string,
		latitude: string,
		shippingStatus: string
	) => {
		try {
			const contractOrder = await appService.contract(userObj);
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
	};

	getAllOrdersOfManufacturer = async (
		userObj: User,
		userId: string,
		status: string
	) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfManufacturer",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orders);
		} catch (error) {
			return error.message;
		}
	};

	getAllOrdersOfDistributor = async (
		userObj: User,
		userId: string,
		status: string
	) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfDistributor",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orders);
		} catch (error) {
			return error.message;
		}
	};

	getAllOrdersOfRetailer = async (
		userObj: User,
		userId: string,
		status: string
	) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const orders = await contractOrder.evaluateTransaction(
				"GetAllOrdersOfRetailer",
				userId,
				status
			);
			return convertBufferToJavasciptObject(orders);
		} catch (error) {
			return error.message;
		}
	};

	getOrder = async (userObj: User, orderId: string) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const order = await contractOrder.evaluateTransaction(
				"GetOrder",
				String(orderId)
			);
			return convertBufferToJavasciptObject(order);
		} catch (error) {
			return error.message;
		}
	};

	getDetailOrder = async (userObj: User, orderId: string) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const order = await contractOrder.evaluateTransaction(
				"GetOrder",
				orderId
			);
			return convertBufferToJavasciptObject(order);
		} catch (error) {
			return error.message;
		}
	};

	createOrder = async (userObj: User, orderObj: OrderForCreate) => {
		try {
			return await appService.submitTransactionCreateOrder(
				"CreateOrder",
				userObj,
				orderObj
			);
		} catch (error) {
			return error.message;
		}
	};

	updateOrder = async (userObj: User, orderObj: any) => {
		try {
			return await appService.submitTransaction(
				"UpdateOrder",
				userObj,
				orderObj
			);
		} catch (error) {
			return error.message;
		}
	};

	finishOrder = async (userObj: User, orderObj: any) => {
		try {
			return await appService.submitTransaction(
				"FinishOrder",
				userObj,
				orderObj
			);
		} catch (error) {
			return error.message;
		}
	};

	getHistoryOrder = async (userObj: User, orderId: string) => {
		try {
			const contractOrder = await appService.contract(userObj);
			const data = await contractOrder.evaluateTransaction(
				"GetHistoryOrder",
				orderId
			);
			return convertBufferToJavasciptObject(data);
		} catch (error) {
			return error.message;
		}
	};

	handleOrderPayloadForCreateToOrderForCreate = async (
		userObj: User,
		orderObj: OrderPayloadForCreate
	) => {
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
					return { ...productIdItem, qrCode: qrCodeString || "" };
				})
			),
			deliveryStatus: orderObj.deliveryStatus,
			signatures: orderObj.signatures,
			qrCode: orderObj.qrCode
		};

		return order;
	};
}

export default OrderService;
