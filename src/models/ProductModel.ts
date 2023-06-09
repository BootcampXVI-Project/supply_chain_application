import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema, Document } from "mongoose";
import { Actor, ProductDate } from "../types/models";
import {
	ProductStatus,
	ProductStatusArray,
	ProductDateStatusArray
} from "../types/types";

interface Product extends Document {
	productId: string;
	productName: string;
	image: string[];
	dates: ProductDate[];
	expireTime: string;
	price: string;
	amount: string;
	unit: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	supplier: Actor;
	qrCode: string;
}

const ProductSchema: Schema<Product> = new Schema<Product>({
	productId: { type: String, default: uuidv4 },
	productName: { type: String, required: true },
	image: { type: [String], required: true },
	dates: {
		type: [Object],
		required: true
	},
	expireTime: { type: String },
	price: { type: String, required: true, default: "0" },
	amount: { type: String, required: true, default: "0" },
	unit: { type: String, required: true, default: "kg" },
	status: {
		type: String,
		enum: ProductStatusArray,
		required: true,
		default: "CULTIVATING"
	},
	description: { type: String, required: true },
	certificateUrl: { type: String, required: true },
	supplier: { type: Object, required: true },
	qrCode: { type: String, required: true }
});

const ProductModel = mongoose.model<Product>("Product", ProductSchema);

export { Product, ProductModel };
