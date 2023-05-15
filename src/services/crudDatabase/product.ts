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
