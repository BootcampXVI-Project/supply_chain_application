import { User } from "../types/models";
import { contract, submitTransaction } from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { getUserByUserId } from "./userService";

export default class OrderService {
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
			const order = await convertBufferToJavasciptObject(orderBuffer);

			// override deliveryStatus
			const { distributorId, retailerId } = order;
			const [distributor, retailer] = await Promise.all([
				getUserByUserId(distributorId),
				getUserByUserId(retailerId)
			]);

			if (order.deliveryStatus[0]) order.deliveryStatus[0].actor = retailer;
			if (order.deliveryStatus[1]) order.deliveryStatus[1].actor = distributor;
			if (order.deliveryStatus[2]) order.deliveryStatus[2].actor = distributor;

			// override products
			order.productItemList.map(async (product: any) => {
				const { supplierId, manufacturerId, distributorId, retailerId } =
					product.actors;
				const [supplier, manufacturer, distributor, retailer] =
					await Promise.all([
						getUserByUserId(supplierId),
						getUserByUserId(manufacturerId),
						getUserByUserId(distributorId),
						getUserByUserId(retailerId)
					]);

				product.dates = [
					{
						status: "cultivated",
						time: product.dates.cultivated,
						actor: supplier
					},
					{
						status: "harvested",
						time: product.dates.harvested,
						actor: supplier
					},
					{
						status: "imported",
						time: product.dates.imported,
						actor: manufacturer
					},
					{
						status: "manufacturered",
						time: product.dates.manufacturered,
						actor: manufacturer
					},
					{
						status: "exported",
						time: product.dates.exported,
						actor: manufacturer
					},
					{
						status: "distributed",
						time: product.dates.distributed,
						actor: distributor
					},
					{
						status: "selling",
						time: product.dates.selling,
						actor: retailer
					},
					{
						status: "sold",
						time: product.dates.sold,
						actor: retailer
					}
				];
			});

			return order;
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
