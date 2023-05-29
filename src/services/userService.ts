import { UserForRegister } from "../types/models";
import { UserModel } from "../models/UserModel";
import { error } from "console";

export const getAllUsers = async () => {
	return await UserModel.find({}).lean();
};

export const getUserByUserId = async (userId: string) => {
	return await UserModel.findOne({ userId: userId })
		.select("-__v -_id -createdAt -updatedAt")
		.lean();
};

export const checkExistedUser = async (phoneNumber: string) => {
	const isExisted = await UserModel.exists({ phoneNumber: phoneNumber });
	return Boolean(isExisted);
};

export const createNewUser = async (user: UserForRegister) => {
	try {
		const isExistedUser: boolean = await checkExistedUser(user.phoneNumber);
		if (isExistedUser == true) {
			throw new Error("phone-number-existed");
		}

		return await UserModel.create(user)
			.then((data) => {
				return {
					data: data,
					error: null
				};
			})
			.catch((error) => {
				throw new Error(error);
			});
	} catch (error) {
		return {
			data: null,
			error: error
		};
	}
};
