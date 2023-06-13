import { ProductDate } from "../types/models";
import mongoose, { Schema, Document } from "mongoose";
import { ProductStatus, ProductStatusArray } from "../types/types";

interface ProductCommercial extends Document {
	productCommercialId: string;
	productId: string;
	productName: string;
	image: string[];
	dates: ProductDate[];
	expireTime: string;
	price: string;
	unit: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	qrCode: string;
}

const ProductCommercialSchema: Schema<ProductCommercial> =
	new Schema<ProductCommercial>({
		productCommercialId: { type: String, required: true },
		productId: { type: String, required: true },
		productName: { type: String, required: true },
		image: { type: [String], required: true },
		dates: {
			type: [Object],
			required: true
		},
		expireTime: { type: String },
		price: { type: String, required: true, default: "0" },
		unit: { type: String, required: true, default: "kg" },
		status: {
			type: String,
			enum: ProductStatusArray,
			required: true,
			default: "CULTIVATED"
		},
		description: { type: String, required: true },
		certificateUrl: { type: String, required: true },
		qrCode: { type: String }
	});

const ProductCommercialModel = mongoose.model<ProductCommercial>(
	"ProductCommercial",
	ProductCommercialSchema
);

export { ProductCommercialModel };
