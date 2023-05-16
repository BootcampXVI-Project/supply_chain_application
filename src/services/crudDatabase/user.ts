import { User } from "../../types/models";
import { UserModel } from "../../models/User";

export const getAllUsers = async () => {
	return await UserModel.find({}).lean();
};

export const getUserByUserId = async (UserId: string) => {
	return await UserModel.findOne({ UserId: UserId }); //.lean();
};

export const checkExistedUser = async (UserId: string) => {
	const isExisted = await UserModel.exists({ UserId: UserId });
	return Boolean(isExisted);
};

export const createNewUser = async (user: User) => {
	try {
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
				throw error;
			});

		return createdUser;
	} catch (error) {
		return {
			data: null,
			message: "failed"
		};
	}
};
