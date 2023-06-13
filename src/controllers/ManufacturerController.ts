import ManufacturerService from "../services/manufacturerService";
import { Request, Response } from "express";
import { DecodeUser } from "../types/common";
import { getUserObjByUserId } from "../services/userService";

const manufacturerService: ManufacturerService = new ManufacturerService();

const ManufacturerController = {
	approveOrderRequest: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const orderId = String(req.body.orderId);
			const userObj = await getUserObjByUserId(user.userId);

			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await manufacturerService.approveOrderRequest(
				userObj,
				orderId
			);

			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("approveOrderRequest", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	rejectOrderRequest: async (req: Request, res: Response) => {
		try {
			const user = req.user as DecodeUser;
			const orderId = String(req.body.orderId);
			const userObj = await getUserObjByUserId(user.userId);
			if (!userObj) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			const data = await manufacturerService.rejectOrderRequest(
				userObj,
				orderId
			);
			return res.json({
				data: data,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("rejectOrderRequest", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default ManufacturerController;
