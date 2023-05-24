import qrCode from "qrcode";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";
// import { getProductById } from "../services/crudDatabase/product";

const QRCodeController = {
	generateQRCode: async (req: Request, res: Response) => {
		try {
			const productId = req.params.productId as string;
			const userId = req.body.userId as string;
			const userObj = await getUserByUserId(userId);
			// const product = await getProductById(productId, userObj);

			const product = {
				ProductId: "Product1",
				ProductName: "Gạo tẻ",
				Dates: {
					Cultivated: "2023-05-17 03:15:23.224 +0000 UTC",
					Harvested: "2023-05-17 04:38:28.312 +0000 UTC",
					Imported: "",
					Manufacturered: "",
					Exported: "",
					Distributed: "",
					Sold: ""
				},
				Actors: {
					SupplierId: "d53acf48-8769-4a07-a23a-d18055603f1e",
					ManufacturerId: "",
					DistributorId: "",
					RetailerId: ""
				},
				Price: "100000",
				Status: "HAVERTED",
				Description: "Gạo tẻ đạt chuẩn"
			};

			if (!product) {
				return res.status(404).json({
					data: null,
					message: "product-notfound",
					error: "product-notfound"
				});
			}

			const qrCodeImage = await qrCode.toDataURL(JSON.stringify(product));

			return res.json({
				data: qrCodeImage,
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

export default QRCodeController;
