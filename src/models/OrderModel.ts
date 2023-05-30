import mongoose, { Schema, Document, Types } from "mongoose";
import { Product } from "./ProductModel";

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
	orderId: string;
	productItemList: ProductItem[];
	signature: Signature;
	deliveryStatus: DeliveryStatus[];
	// status: "shipped" | "shipping" | "not-shipped-yet";
	status: string;
	distributorId: string;
	retailerId: string;
	qrCode: string;
}

interface OrderDB extends Order, Document {
	_id: Types.ObjectId;
}

const OrderSchema: Schema<OrderDB> = new Schema<OrderDB>({
	orderId: { type: String, required: true },
	productItemList: { type: [Object], required: true },
	signature: { type: Object, required: true },
	deliveryStatus: { type: [Object], required: true },
	status: { type: String, required: true },
	distributorId: { type: String, required: true },
	retailerId: { type: String, required: true },
	qrCode: { type: String, required: true }
});

const OrderModel = mongoose.model<OrderDB>("Order", OrderSchema);

export { Order, OrderDB, OrderModel };
