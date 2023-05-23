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
}

interface Order {
	orderID: string;
	productItemList: ProductItem[];
	signature: Signature;
	deliveryStatus: DeliveryStatus[];
	status: string;
	distributorId: string;
	retailerId: string;
}

interface OrderDB extends Order, Document {
	_id: Types.ObjectId;
}

const OrderSchema: Schema<OrderDB> = new Schema<OrderDB>({
	orderID: { type: String, required: true },
	productItemList: { type: [Object], required: true },
	signature: { type: Object, required: true },
	deliveryStatus: { type: [Object], required: true },
	status: { type: String, required: true },
	distributorId: { type: String, required: true },
	retailerId: { type: String, required: true }
});

const OrderModel = mongoose.model<OrderDB>("Order", OrderSchema);

export { Order, OrderDB, OrderModel };
