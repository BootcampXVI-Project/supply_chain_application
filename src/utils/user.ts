export class User {
	// id: string;
	// org: "Supplier" | "Manufacturer" | "Distributor" | "Retailer" | "Consumer";
	// address: string;
	// telephone: string;
	// role: string;
	// username: string;

	// constructor(obj: {
	// 	id: string;
	//  org: "Supplier" | "Manufacturer" | "Distributor" | "Retailer" | "Consumer";
	//  address: string;
	// 	tel: string;
	//  role: string;
	// 	username: string;
	// }) {
	// 	this.id = obj.id;
	// 	this.org = obj.org;
	// 	this.address = obj.address;
	// 	this.telephone = obj.tel;
	// 	this.role = obj.role;
	// 	this.username = obj.username;
	// }
	// userId: string;
	email: string;
	password: string;
	userName: string;
	address: string;
	org: "supplier" | "manufacturer" | "distributor" | "retailer" | "consumer";
	role: string;
	// status: string;
}

export class Product {
	ProductId: string;
	ProductName: string;
	Dates: ProductDate;
	actors: string;
	Price: string;
	status: string;
	Description: string;
}

export class ProductDate {
	Cultivated: string; // supplier
	Harvested: string;
	Imported: string; // manufacturer
	Manufacturered: string;
	Exported: string;
	Distributed: string; // distributor
	sold: string; // retailer
}
