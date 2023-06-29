import { NextFunction } from "express";
import { User, UserModel } from "../../models/UserModel";

export const autoIncrementId = async function (this: User, next: NextFunction) {
	const lastUser = await UserModel.findOne({ role: this.role }).sort({
		roleId: -1
	});

	if (lastUser) {
		this.roleId = lastUser.roleId + 1;
	} else {
		this.roleId = 1;
	}

	next();
};

export const getNextRoleId = async (role: string): Promise<number> => {
	const lastUser = await UserModel.findOne({ role }).sort({ roleId: -1 });

	if (lastUser) {
		return lastUser.roleId + 1;
	} else {
		return 1;
	}
};
