import { User, UserForRegister } from "../../types/models";
import { UserModel } from "../../models/UserModel";

export const getAllUsers = async () => {
	return await UserModel.find({}).lean();
};

// export const getUserByUserId = async (userId: string) => {
// 	return await UserModel.findOne({ userId: userId }).lean();
// };

export const getUserByUserId = async (userId: string) => {
	return await UserModel.findOne({ userId: userId })
		.select("-__v -_id -createdAt -updatedAt")
		.lean();
};

export const checkExistedUser = async (userId: string) => {
	const isExisted = await UserModel.exists({ userId: userId });
	return Boolean(isExisted);
};

export const createNewUser = async (user: UserForRegister) => {
	try {
		// const isExistedUser: boolean = await checkExistedUser(user.userId);
		// if (isExistedUser == true) {
		// 	return {
		// 		data: {},
		// 		message: "userid-existed"
		// 	};
		// }

		const createdUser = await UserModel.create(user)
			.then((data) => {
				console.log(data);
				return {
					data: data,
					message: "successfully"
				};
			})
			.catch((error) => {
				console.log(error);
				return {
					data: null,
					message: error
				};
			});

		return createdUser;
	} catch (error) {
		return {
			data: null,
			message: "failed"
		};
	}
};


