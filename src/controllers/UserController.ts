import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	registerUser,
	submitTransaction
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { getUserByUserId } from "../services/crudDatabase/user";
import { Request, Response } from "express";

const ProductController = {
	// DOING
	createUser: async (req: Request, res: Response) => {
		try {
			const userObj = req.body.userObj;

			// await submitTransaction("CreateUser", userObj, null);

			// const userObj: UserForRegister = {
			// 	Email: "Ryn@gmail.com",
			// 	Password: "Ryn",
			// 	UserName: "Ryn",
			// 	Address: "Ryn",
			// 	UserType: "supplier",
			// 	Role: "supplier",
			// 	Status: "ACTIVE"
			// };

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
	}
};

export default ProductController;
