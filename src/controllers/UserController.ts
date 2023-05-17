import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	submitTransaction,
	registerUser
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { getUserByUserId, getAllUsers } from "../services/crudDatabase/user";
import { Request, Response } from "express";

const ProductController = {
	// DONE
	createUser: async (req: Request, res: Response) => {
		try {
			const userObj = req.body.userObj;
			const createdUser = await registerUser(userObj);

			return res.json({
				data: createdUser,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	// DONE
	getAllUsers: async (req: Request, res: Response) => {
		try {
			const users = await getAllUsers();

			return res.json({
				data: users,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	// DONE
	getUser: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const users = await getUserByUserId(userId);

			return res.json({
				data: users,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	}
};

export default ProductController;
