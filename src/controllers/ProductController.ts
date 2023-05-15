import { Product, User } from "../types/models";
import { RequestFunction } from "../types/common";
import { evaluateTransaction, submitTransaction } from "../app";

const ProductController = {
	getAllProducts: async ({ req, res, next }: RequestFunction) => {
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

			const result = await evaluateTransaction("GetAllProducts", userObj, null);
			const resultString = result.toString("utf-8"); // Chuyển buffer thành chuỗi UTF-8
			const resultJson = JSON.parse(resultString); // Chuyển chuỗi JSON thành đối tượng JavaScript

			return res.json({
				data: resultJson,
				message: "successfully"
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed"
			});
		}
	},
	cultivateProduct: async ({ req, res, next }: RequestFunction) => {
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
			const productObj: Product = {
				ProductId: "P004",
				ProductName: "Gạo tẻ",
				Dates: {
					Cultivated: "2023-01-02", // supplier
					Harvested: "",
					Imported: "", // manufacturer
					Manufacturered: "",
					Exported: "",
					Distributed: "", // distributor
					Sold: "" // retailer
				},
				Actors: {
					SupplierId: "d53acf48-8769-4a07-a23a-d18055603f1e",
					ManufacturerId: "",
					DistributorId: "",
					RetailerId: ""
				},
				Price: "150 USD",
				Status: "Available",
				Description: "Gạo tẻ đạt chuẩn"
			};

			const result = await submitTransaction(
				"CultivateProduct",
				userObj,
				productObj
			);

			return res.json({
				data: result,
				message: "successfully"
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed"
			});
		}
	}
};

export default ProductController;
