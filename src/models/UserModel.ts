import mongoose, { Schema, Document, Types } from "mongoose";

interface UserProperties {
	_id: Types.ObjectId;
	Email: string;
	Password: string;
	UserName: string;
	Address: string;
	UserType: string;
	Role: "supplier" | "manufacturer" | "distributor" | "retailer" | "consumer";
	UserId?: string;
	Status?: string;
}

interface User extends UserProperties, Document {
	_id: Types.ObjectId;
}

const UserSchema: Schema<User> = new Schema<User>({
	Email: { type: String, required: true },
	Password: { type: String, required: true },
	UserName: { type: String, required: true },
	Address: { type: String, required: true },
	UserType: { type: String, required: true },
	Role: {
		type: String,
		enum: ["supplier", "manufacturer", "distributor", "retailer", "consumer"],
		required: true
	},
	UserId: { type: String },
	Status: { type: String }
});

const UserModel = mongoose.model<User>("User", UserSchema);

export { User, UserModel };
