import { log } from "console";
import UserModel from "../../models/User";
import { User } from "../../types/models";
import _ from "lodash";

export const getAllUsers = async () => {
	const users = await UserModel.find({}).lean();
	return users;
};

export const getUserById = async (UserId: string) => {
	return await UserModel.findOne({ UserId: UserId }).lean();
};

export const checkExistedUser = async (UserId: string) => {
	const isExisted = await UserModel.exists({ UserId: UserId });
	log(Boolean(isExisted));
	return Boolean(isExisted);
};

export const createNewUser = async (user: User) => {
	try {
		// validate user ...

		const isExistedUser: boolean = await checkExistedUser(user.UserId);
		if (isExistedUser == true) {
			return {
				data: {},
				message: "userid-existed"
			};
		}

		const createdUser = await UserModel.create(user)
			.then((data) => {
				return {
					data: data,
					message: "successfully"
				};
			})
			.catch((error) => {
				log("error", error);
				throw error;
			});

		return createdUser;
	} catch (error) {
		log(error);
		return {
			data: null,
			message: "failed"
		};
	}
};
