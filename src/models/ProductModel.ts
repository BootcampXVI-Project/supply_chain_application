import mongoose, { Schema, Document, Types } from "mongoose";

interface ProductDates {
	Cultivated: string;
	Harvested: string;
	Imported: string;
	Manufacturered: string;
	Exported: string;
	Distributed: string;
	Sold: string;
}

interface ProductActors {
	SupplierId: string;
	ManufacturerId: string;
	DistributorId: string;
	RetailerId: string;
}

interface Product extends Document {
	ProductId: string;
	ProductName: string;
	Dates: ProductDates;
	Actors: ProductActors;
	Price: string;
	Status: string;
	Description: string;
}

const ProductSchema: Schema<Product> = new Schema<Product>({
	ProductId: { type: String },
	ProductName: { type: String, required: true },
	Dates: {
		Cultivated: { type: String },
		Harvested: { type: String },
		Imported: { type: String },
		Manufacturered: { type: String },
		Exported: { type: String },
		Distributed: { type: String },
		Sold: { type: String }
	},
	Actors: {
		SupplierId: { type: String },
		ManufacturerId: { type: String },
		DistributorId: { type: String },
		RetailerId: { type: String }
	},
	Price: { type: String, required: true },
	Status: {
		type: String,
		enum: [
			"CULTIVATING",
			"HAVERTED",
			"IMPORTED",
			"MANUFACTURED",
			"EXPORTED",
			"DISTRIBUTED",
			"SOLD"
		],
		required: true
	},
	Description: { type: String, required: true }
});

const ProductModel = mongoose.model<Product>("Product", ProductSchema);

export { Product, ProductModel };
