import { registerUser } from "../app";
import { Request, Response } from "express";
import { getUserObjByUserId, getAllUsers } from "../services/userService";

const UserController = {
	createUser: async (req: Request, res: Response) => {
		try {
			const userObj = req.body.userObj;
			const createdUser = await registerUser(userObj);

			return createdUser.data !== null
				? res.json({
						data: createdUser.data,
						message: "successfully",
						error: null
				  })
				: res.json({
						data: null,
						message: "failed",
						error: createdUser.error
				  });
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

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
				error: error.message
			});
		}
	},

	getUser: async (req: Request, res: Response) => {
		try {
			const userId = String(req.params.userId);
			const users = await getUserObjByUserId(userId);

			return res.json({
				data: users,
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
	}
};

export default UserController;
