export type UserStatus = "active" | "inactive";
export const UserStatusArray = ["active", "inactive"];

export type UserRole =
	| "supplier"
	| "manufacturer"
	| "distributor"
	| "retailer"
	| "consumer";
export const UserRoleArray = [
	"supplier",
	"manufacturer",
	"distributor",
	"retailer",
	"consumer"
];

export type ProductStatus =
	| "CULTIVATING"
	| "HARVESTED"
	| "IMPORTED"
	| "MANUFACTURED"
	| "EXPORTED"
	| "DISTRIBUTED"
	| "SELLING"
	| "SOLD";
export const ProductStatusArray = [
	"CULTIVATING",
	"HARVESTED",
	"IMPORTED",
	"MANUFACTURED",
	"EXPORTED",
	"DISTRIBUTED",
	"SELLING",
	"SOLD"
];

export type OrderStatus = "NOT-SHIPPED-YET" | "SHIPPING" | "SHIPPED";
export const OrderStatusArray = ["NOT-SHIPPED-YET", "SHIPPING", "SHIPPED"];

export interface UserForRegister {
	email: string;
	password: string;
	userName: string;
	fullName: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
	status?: UserStatus;
	signature: string;
}

export interface User {
	email: string;
	password: string;
	userName: string;
	fullName: string;
	phoneNumber: string;
	address: string;
	role: UserRole;
	status?: UserStatus;
	userId?: string;
	signature: string;
}

export type ProductDates = {
	cultivated: string;
	harvested: string;
	imported: string;
	manufacturered: string;
	exported: string;
	distributed: string;
	selling: string;
	sold: string;
};

export type ProductActors = {
	supplierId: string;
	manufacturerId: string;
	distributorId: string;
	retailerId: string;
};

export type Product = {
	productId: string;
	productName: string;
	image: string[];
	dates: ProductDates;
	actors: ProductActors;
	expireTime: string;
	price: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	cooperationId: string;
	qrCode: string;
};

export type ProductHistory = {
	record: Product;
	txId: string;
	timestamp: Date;
	isDelete: boolean;
};

export type Cooperation = {
	cooperationId: string;
	name: string;
	description: string;
	address: string;
	founderId: string;
	longitude: string;
	latitude: string;
};

export type Auth = {
	phoneNumber: string;
	otp: string;
	expired: Date;
};

export type Signature = {
	distributorSignature: string;
	retailerSignature: string;
};

export type ProductItem = {
	product: Product;
	quantity: string;
};

export type DeliveryStatus = {
	distributedId: string;
	deliveryDate: string;
	status: OrderStatus;
	longitude: string;
	latitude: string;
};

export type Order = {
	orderId: string;
	productItemList: ProductItem[];
	signature: Signature;
	deliveryStatus: DeliveryStatus[];
	status: OrderStatus;
	location: string;
	distributorId: string;
	retailerId: string;
	qrCode: string;
	createDate: string;
	updateDate: string;
	finishDate: string;
};
