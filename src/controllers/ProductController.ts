import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	submitTransaction
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";
import { createProduct } from "../services/crudDatabase/product";
import { ObjectId } from "../constants";

const ProductController = {
	getProduct: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const productId = String(req.query.productId);
			const userObj = await getUserByUserId(userId);

			const productBuffer = await evaluateTransactionUserObjProductId(
				"GetProduct",
				userObj,
				String(productId)
			);
			const product = convertBufferToJavasciptObject(productBuffer);

			return res.json({
				data: product,
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
			// const userObj: User = {
			// 	_id: new ObjectId("6461cead9b2c9e3a017ef195"),
			// 	UserId: "d53acf48-8769-4a07-a23a-d18055603f1e",
			// 	Email: "Parker@gmail.com",
			// 	Password: "Parker",
			// 	UserName: "Parker",
			// 	Address: "Parker",
			// 	UserType: "supplier",
			// 	Role: "supplier",
			// 	Status: "UN-ACTIVE"
			// };

			const userId = String(req.query.userId);
			const userObj = await getUserByUserId(userId);

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
			// 	_id: new ObjectId("6461cead9b2c9e3a017ef195"),
			// 	UserId: "d53acf48-8769-4a07-a23a-d18055603f1e",
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
			// 		SupplierId: "",
			// 		ManufacturerId: "",
			// 		DistributorId: "",
			// 		RetailerId: ""
			// 	},
			// 	Price: "150 USD",
			// 	Status: "",
			// 	Description: "Gạo tẻ đạt chuẩn"
			// };

			const { userObj, productObj } = req.body;
			await submitTransaction("CultivateProduct", userObj, productObj);

			const createdProduct = await createProduct(userObj.UserId, productObj);
			console.log("createdProduct", createdProduct);

			if (createdProduct.data) {
				return res.json({
					data: createdProduct.data,
					message: "successfully",
					error: null
				});
			} else {
				return res.json({
					data: null,
					message: "failed",
					error: createdProduct.data
				});
			}
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
