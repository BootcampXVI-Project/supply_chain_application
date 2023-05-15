export class User {
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
	Email: string;
	Password: string;
	UserName: string;
	Address: string;
	org: "supplier" | "manufacturer" | "distributor" | "retailer" | "consumer";
	role: string;
	Status: string;
}

export class Product {
	ProductId: string;
	ProductName: string;
	Dates: ProductDate;
	Actors: string;
	Price: string;
	Status: string;
	Description: string;
}

export class ProductDate {
	Cultivated: string; // supplier
	Harvested: string;
	Imported: string; // manufacturer
	Manufacturered: string;
	Exported: string;
	Distributed: string; // distributor
	Sold: string; // retailer
}
