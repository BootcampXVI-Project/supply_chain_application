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
import { FirebaseStorage } from "firebase/storage";

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

	//Supplier
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
			// await createProduct(userObj.userId, productObj);

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
	},

	addCertificate: async (req:Request, res: Response) => {
		try {
			const { userObj, productObj } = req.body;
			let product = await ProductController.getProduct(req, res)
			if (!product) {
				throw new Error("Content not found !!!");
			}

			const base64String = productObj.split("base64,")[1];
			const bytesImage = Buffer.from(base64String, "base64");
			const storage = new FirebaseStorage("supplychain.app.com");
			const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(bytesImage); }, pull() { }, cancel() { } });

			product.CertificateUrl = await storage.child("Certificate").put(stream);
			const result = await submitTransaction(
				"AddCertificate",
				userObj,
				product
			);

			return res.json({
				data: result,
				message: "successfully",
				error: null
			})
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