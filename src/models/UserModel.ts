import {
	UserRole,
	UserRoleArray,
	UserStatus,
	UserStatusArray
} from "../types/types";
import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema, Document, Types } from "mongoose";

interface User {
	email: string;
	password: string;
	userName: string;
	fullName: string;
	avatar: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
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
	userName: { type: String },
	fullName: { type: String, required: true },
	avatar: { type: String },
	phoneNumber: { type: String, required: true },
	address: { type: String, required: true },
	role: {
		type: String,
		enum: UserRoleArray,
		default: "supplier"
	},
	userId: { type: String, default: uuidv4 },
	status: { type: String, enum: UserStatusArray, default: "inactive" },
	signature: { type: String }
});

const UserModel = mongoose.model<UserDB>("User", UserSchema);

export { User, UserDB, UserModel };
