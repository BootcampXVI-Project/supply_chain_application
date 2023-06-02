import { Product } from "./ProductModel";
import { OrderStatus, OrderStatusArray } from "../types/types";
import mongoose, { Schema, Document, Types } from "mongoose";

interface Signature {
	distributorSignature: string;
	retailerSignature: string;
}

interface ProductItem {
	product: Product;
	quantity: string;
}

interface DeliveryStatus {
	distributedId: string;
	deliveryDate: string;
	status: string;
	longitude: string;
	latitude: string;
}

interface Order {
	orderId?: string;
	productItemList: ProductItem[];
	signature: Signature;
	deliveryStatus: DeliveryStatus[];
	status: OrderStatus;
	distributorId: string;
	retailerId: string;
	qrCode: string;
	createDate: string;
	updateDate: string;
	finishDate: string;
}

interface OrderDB extends Order, Document {
	_id: Types.ObjectId;
}

const OrderSchema: Schema<OrderDB> = new Schema<OrderDB>({
	orderId: { type: String, required: true },
	productItemList: { type: [Object], required: true },
	signature: { type: Object, required: true },
	deliveryStatus: { type: [Object], required: true },
	status: {
		type: String,
		enum: OrderStatusArray,
		required: true,
		default: "NOT-SHIPPED-YET"
	},
	distributorId: { type: String, required: true },
	retailerId: { type: String, required: true },
	qrCode: { type: String, required: true },
	createDate: { type: String, required: false, default: new Date().toString() },
	updateDate: { type: String, required: false, default: new Date().toString() },
	finishDate: { type: String, required: false, default: "" }
});

const OrderModel = mongoose.model<OrderDB>("Order", OrderSchema);

export { Order, OrderDB, OrderModel };
