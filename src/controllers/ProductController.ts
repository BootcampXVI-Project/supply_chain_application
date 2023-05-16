import { Product, User } from "../types/models";
import { RequestFunction } from "../types/common";
import { evaluateTransaction, submitTransaction } from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { Request, Response } from "express";
import { log } from "console";

const ProductController = {
	getProduct: async (req: Request, res: Response) => {
		try {
			const userObj: User = {
				UserId: "d53acf48-8769-4a07-a23a-d18055603f1e", //uuidv4(),
				Email: "Parker@gmail.com",
				Password: "Parker",
				UserName: "Parker",
				Address: "Parker",
				UserType: "supplier",
				Role: "supplier",
				Status: "UN-ACTIVE"
			};

			const productsBuffer = await evaluateTransaction(
				"GetProduct",
				userObj,
				null
			);
			const products = convertBufferToJavasciptObject(productsBuffer);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	getAllProducts: async (req: Request, res: Response) => {
		try {
			const userObj: User = {
				UserId: "d53acf48-8769-4a07-a23a-d18055603f1e", //uuidv4(),
				Email: "Parker@gmail.com",
				Password: "Parker",
				UserName: "Parker",
				Address: "Parker",
				UserType: "supplier",
				Role: "supplier",
				Status: "UN-ACTIVE"
			};

			const productsBuffer = await evaluateTransaction(
				"GetAllProducts",
				userObj,
				null
			);
			const products = convertBufferToJavasciptObject(productsBuffer);

			return res.json({
				data: products,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	cultivateProduct: async (req: Request, res: Response) => {
		try {
			// const userObj: User = {
			// 	UserId: "d53acf48-8769-4a07-a23a-d18055603f1e", //uuidv4(),
			// 	Email: "Parker@gmail.com",
			// 	Password: "Parker",
			// 	UserName: "Parker",
			// 	Address: "Parker",
			// 	UserType: "supplier",
			// 	Role: "supplier",
			// 	Status: "UN-ACTIVE"
			// };
			// const productObj: Product = {
			// 	ProductId: "P004",
			// 	ProductName: "Gạo tẻ",
			// 	Dates: {
			// 		Cultivated: "2023-01-02", // supplier
			// 		Harvested: "",
			// 		Imported: "", // manufacturer
			// 		Manufacturered: "",
			// 		Exported: "",
			// 		Distributed: "", // distributor
			// 		Sold: "" // retailer
			// 	},
			// 	Actors: {
			// 		SupplierId: "d53acf48-8769-4a07-a23a-d18055603f1e",
			// 		ManufacturerId: "",
			// 		DistributorId: "",
			// 		RetailerId: ""
			// 	},
			// 	Price: "150 USD",
			// 	Status: "Available",
			// 	Description: "Gạo tẻ đạt chuẩn"
			// };

			const { userObj, productObj } = req.body;

			const result = await submitTransaction(
				"CultivateProduct",
				userObj,
				productObj
			);
			// const createdProduct = convertBufferToJavasciptObject(result);

			return res.json({
				data: result,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	}
};

export default ProductController;
