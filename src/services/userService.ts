import { UserForRegister } from "../types/models";
import { UserModel } from "../models/UserModel";

export const getAllUsers = async () => {
	return await UserModel.find({}).lean();
};

export const getUserByUserId = async (userId: string) => {
	console.log(1);
	return await UserModel.findOne({ userId: userId })
		.select("-__v -_id -createdAt -updatedAt -password -status")
		.lean();
};

export const checkExistedUserEmail = async (email: string) => {
	const isExisted = await UserModel.exists({ email: email });
	return Boolean(isExisted);
};

export const checkExistedUserPhoneNumber = async (phoneNumber: string) => {
	const isExisted = await UserModel.exists({ phoneNumber: phoneNumber });
	return Boolean(isExisted);
};

export const createNewUser = async (user: UserForRegister) => {
	try {
		const [isExistedUserEmail, isExistedUserPhoneNumber] = await Promise.all([
			checkExistedUserEmail(user.email),
			checkExistedUserPhoneNumber(user.phoneNumber)
		]);

		if (isExistedUserEmail) {
			throw new Error("email-existed");
		}

		if (isExistedUserPhoneNumber) {
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
			error: error.message
		};
	}
};
