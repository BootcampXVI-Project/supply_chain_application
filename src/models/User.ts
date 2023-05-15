import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		UserId: {
			type: String,
			trim: true,
			required: false,
			unique: true
		},
		Email: {
			type: String,
			trim: true,
			required: true,
			unique: true
		},
		Password: {
			type: String,
			trim: true,
			required: true
		},
		UserName: {
			type: String,
			trim: true,
			required: true,
			unique: true
		},
		Address: {
			type: String,
			trim: true,
			required: true
		},
		UserType: {
			type: String,
			trim: true,
			required: true,
			unique: false
		},
		Role: {
			type: String,
			trim: true,
			required: true
			// enum: ["supplier", "manufacturer", "distributor", "retailer", "consumer"]
		},
		Status: {
			type: String,
			trim: true,
			required: false
		}
	},
	{ timestamps: true, versionKey: false }
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;

// Product.Status = "CULTIVATING" | "HAVERTED" | "IMPORTED" | "MANUFACTURED" | "EXPORTED" | "DISTRIBUTED" | "SOLD"
