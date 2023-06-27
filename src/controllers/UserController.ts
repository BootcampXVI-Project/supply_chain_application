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
				? res.status(200).json({
						data: createdUser.data,
						message: "successfully",
						error: null
				  })
				: res.status(400).json({
						data: null,
						message: "failed",
						error: createdUser.error
				  });
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	},

	getAllUsers: async (req: Request, res: Response) => {
		try {
			const users = await userService.getAllUsers();

			return res.status(200).json({
				data: users,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
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

			return res.status(200).json({
				data: users,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
};

export default UserController;
