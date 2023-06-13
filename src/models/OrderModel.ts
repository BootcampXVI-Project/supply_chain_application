import mongoose, { Schema, Document, Types } from "mongoose";
import { OrderStatus, OrderStatusArray } from "../types/types";
import { Actor, DeliveryStatus, ProductCommercialItem } from "../types/models";

interface Order {
	orderId?: string;
	productItemList: ProductCommercialItem[];
	signatures: string[];
	deliveryStatuses: DeliveryStatus[];
	status: OrderStatus;
	manufacturer: Actor;
	distributor: Actor;
	retailer: Actor;
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
	signatures: { type: [String], required: true },
	deliveryStatuses: { type: [Object], required: true },
	status: {
		type: String,
		enum: OrderStatusArray,
		required: true,
		default: "PENDING"
	},
	manufacturer: { type: Object, required: true },
	distributor: { type: Object, required: true },
	retailer: { type: Object, required: true },
	qrCode: { type: String, required: true },
	createDate: { type: String, default: new Date().toString() },
	updateDate: { type: String, default: "" },
	finishDate: { type: String, default: "" }
});

const OrderModel = mongoose.model<OrderDB>("Order", OrderSchema);

export { OrderDB, OrderModel };
