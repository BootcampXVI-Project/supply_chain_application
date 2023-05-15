export type User = {
	UserId: string;
	Email: string;
	Password: string;
	UserName: string;
	Address: string;
	UserType: string;
	Role: "supplier" | "manufacturer" | "distributor" | "retailer" | "consumer";
	Status?: string;
};

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
	Status: string;
	Description: string;
};

export type ProductHistory = {
	Record: Product;
	TxId: string;
	Timestamp: Date;
	IsDelete: boolean;
};
