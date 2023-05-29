export type UserStatus = "active" | "inactive";

export type UserRoleType =
	| "supplier"
	| "manufacturer"
	| "distributor"
	| "retailer"
	| "consumer";

export type ProductStatus =
	| "CULTIVATING"
	| "HARVESTED"
	| "IMPORTED"
	| "MANUFACTURED"
	| "EXPORTED"
	| "DISTRIBUTED"
	| "SOLD";

export interface UserForRegister {
	email: string;
	password: string;
	userName: string;
	phoneNumber: string;
	address: string;
	userType: UserRoleType;
	role: UserRoleType;
	status?: UserStatus;
	identify: string;
}

export interface User {
	email: string;
	password: string;
	userName: string;
	phoneNumber: string;
	address: string;
	userType: UserRoleType;
	role: UserRoleType;
	status?: UserStatus;
	userId?: string;
	identify: string;
}

export type ProductDates = {
	cultivated: string;
	harvested: string;
	imported: string;
	manufacturered: string;
	exported: string;
	distributed: string;
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
	dates: ProductDates;
	actors: ProductActors;
	expiredTime: string;
	amount: string;
	price: string;
	status: ProductStatus;
	description: string;
	certificateUrl: string;
	cooperationId: string;
	image: string[];
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
	status: string;
	longitude: string;
	latitude: string;
};

export type Order = {
	orderId: string;
	productItemList: ProductItem[];
	signature: Signature;
	deliveryStatus: DeliveryStatus[];
	status: string;
	location: string;
	distributorId: string;
	retailerId: string;
};
