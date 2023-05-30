import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRoleType, UserStatus } from "../types/models";

interface User {
	email: string;
	password: string;
	userName: string;
	fullName: string;
	phoneNumber: string;
	address: string;
	role: UserRoleType;
	userId?: string;
	status?: UserStatus;
	signature: string;
}

interface UserDB extends User, Document {
	_id: Types.ObjectId;
}

const UserSchema: Schema<UserDB> = new Schema<UserDB>({
	email: { type: String, required: true },
	password: { type: String, required: true },
	userName: { type: String, required: true },
	fullName: { type: String, required: true },
	phoneNumber: { type: String, required: true },
	address: { type: String, required: true },
	role: {
		type: String,
		enum: ["supplier", "manufacturer", "distributor", "retailer", "consumer"],
		required: true
	},
	userId: { type: String, default: uuidv4 },
	status: { type: String, enum: ["active", "inactive"], default: "inactive" },
	signature: { type: String }
});

const UserModel = mongoose.model<UserDB>("User", UserSchema);

export { User, UserDB, UserModel };
