import { v4 as uuidv4 } from "uuid";
import { ProductIdItem } from "../types/models";
import mongoose, { Schema, Document, Types } from "mongoose";
import { autoIncrementId } from "../middlewares/autoIncreasementId";
import {
	UserRole,
	UserRoleArray,
	UserStatus,
	UserStatusArray
} from "../types/types";

interface User {
	userId?: string;
	userCode: string;
	email: string;
	password: string;
	userName: string;
	fullName: string;
	avatar: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
	roleId: number;
	status?: UserStatus;
	signature: string;
	cart: ProductIdItem[];
}

interface UserDB extends User, Document {
	_id: Types.ObjectId;
}

const UserSchema: Schema<UserDB> = new Schema<UserDB>({
	userId: { type: String, default: uuidv4 },
	userCode: { type: String },
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
	roleId: { type: Number, default: 0 },
	status: { type: String, enum: UserStatusArray, default: "inactive" },
	signature: { type: String },
	cart: { type: [Object] }
});

UserSchema.pre<User>("save", autoIncrementId);
const UserModel = mongoose.model<UserDB>("User", UserSchema);

export { User, UserDB, UserModel };
