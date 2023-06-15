import AppService from "../appService";
import UserService from "../services/userService";
import { Request, Response } from "express";

const appService: AppService = new AppService();
const userService: UserService = new UserService();

const UserController = {
	createUser: async (req: Request, res: Response) => {
		try {
			const userObj = req.body.userObj;
			const createdUser = await appService.registerUser(userObj);

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
			const users = await userService.getAllUsers();

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
			const users = await userService.getUserById(userId);

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
