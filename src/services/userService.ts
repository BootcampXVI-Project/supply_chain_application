import { UserModel } from "../models/UserModel";
import { UserForRegister } from "../types/models";

class UserService {
	getAllUsers = async () => {
		return await UserModel.find({}).lean();
	};

	getUserByUserId = async (userId: string) => {
		return await UserModel.findOne({ userId: userId })
			.select("-__v -_id -createdAt -updatedAt -password -status")
			.lean();
	};

	getUserObjByUserId = async (userId: string) => {
		return await UserModel.findOne({ userId: userId })
			.select("-__v -_id -createdAt -updatedAt")
			.lean();
	};

	checkExistedUserEmail = async (email: string) => {
		const isExisted = await UserModel.exists({ email: email });
		return Boolean(isExisted);
	};

	checkExistedUserId = async (userId: string) => {
		const isExisted = await UserModel.exists({ userId: userId });
		return Boolean(isExisted);
	};

	checkExistedUserPhoneNumber = async (phoneNumber: string) => {
		const isExisted = await UserModel.exists({ phoneNumber: phoneNumber });
		return Boolean(isExisted);
	};

	createNewUser = async (user: UserForRegister) => {
		try {
			const [isExistedUserEmail, isExistedUserPhoneNumber] = await Promise.all([
				this.checkExistedUserEmail(user.email),
				this.checkExistedUserPhoneNumber(user.phoneNumber)
			]);

			if (isExistedUserEmail) {
				throw new Error("email-existed");
			}
			if (isExistedUserPhoneNumber) {
				throw new Error("phone-number-existed");
			}

			const userPayload = {
				...user,
				userName: user.fullName,
				status: "inactive"
			};

			return await UserModel.create(userPayload)
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
}

export default UserService;
