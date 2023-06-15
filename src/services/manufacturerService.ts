import AppService from "../appService";
import { User } from "../types/models";

const appService: AppService = new AppService();

class ManufacturerService {
	approveOrderRequest = async (userObj: User, orderId: string) => {
		try {
			return await appService.submitTransactionOrderId(
				"ApproveOrder",
				userObj,
				orderId
			);
		} catch (error) {
			return error.message;
		}
	};

	rejectOrderRequest = async (userObj: User, orderId: string) => {
		try {
			return await appService.submitTransactionOrderId(
				"RejectOrder",
				userObj,
				orderId
			);
		} catch (error) {
			return error.message;
		}
	};
}

export default ManufacturerService;
