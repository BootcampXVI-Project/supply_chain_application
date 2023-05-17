import { Types } from "mongoose";

export interface UserForRegister {
	Email: string;
	Password: string;
	UserName: string;
	Address: string;
	UserType:
		| "supplier"
		| "manufacturer"
		| "distributor"
		| "retailer"
		| "consumer";
	Role: "supplier" | "manufacturer" | "distributor" | "retailer" | "consumer";
	Status?: "ACTIVE" | "UN-ACTIVE";
}

export interface User {
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

export type ProductDates = {
	Cultivated: string; // supplier
	Harvested: string;
	Imported: string; // manufacturer
	Manufacturered: string;
	Exported: string;
	Distributed: string; // distributor
	Sold: string; // retailer
};

export type ProductActors = {
	SupplierId: string;
	ManufacturerId: string;
	DistributorId: string;
	RetailerId: string;
};

export type Product = {
	ProductId: string;
	ProductName: string;
	Dates: ProductDates;
	Actors: ProductActors;
	Price: string;
	Status:
		| "CULTIVATING"
		| "HAVERTED"
		| "IMPORTED"
		| "MANUFACTURED"
		| "EXPORTED"
		| "DISTRIBUTED"
		| "SOLD";
	Description: string;
};

export type ProductHistory = {
	Record: Product;
	TxId: string;
	Timestamp: Date;
	IsDelete: boolean;
};
