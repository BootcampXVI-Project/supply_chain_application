import { Request, Response } from "express";
import { getUserByUserId } from "../services/userService";
import { convertBufferToJavasciptObject } from "../helpers";
import { evaluateTransactionUserObjAnyParam, submitTransaction } from "../app";

const DistributorController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const shippingStatus = String(req.query.shippingStatus);
			const userId = String(req.body.userId);

			const userObj = await getUserByUserId(userId);
			const queryObj = {
				address: userObj.address,
				shippingStatus: shippingStatus
			};

			const productsBuffer = await evaluateTransactionUserObjAnyParam(
				"GetAllProductsByShippingStatus",
				userObj,
				queryObj
			);
			const products = convertBufferToJavasciptObject(productsBuffer);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	updateProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.body.userId);
			const productObj = req.body.productObj;

			const userObj = await getUserByUserId(userId);
			if (!userObj) {
				return res.json({
					message: "User not found!",
					status: "notfound"
				});
			}
			if (userObj.role != "distributor") {
				return res.json({
					message: "Denied permission! User must be a distributor!",
					status: "unauthorize"
				});
			}

			await submitTransaction("UpdateProduct", userObj, productObj);

			return res.json({
				data: null,
				message: "successfully",
				error: null
			});
		} catch (error) {
			console.log("updateProduct", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default DistributorController;
