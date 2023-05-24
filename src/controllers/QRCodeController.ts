import qrCode from "qrcode";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";
import { getProductById } from "../services/crudDatabase/product";

const QRCodeController = {
	generateQRCode: async (req: Request, res: Response) => {
		try {
			const productId = req.params.productId as string;
			const userId = req.body.userId as string;
			const userObj = await getUserByUserId(userId);
			const productObj = await getProductById(productId, userObj);

			if (!productObj) {
				return res.status(404).json({
					data: null,
					message: "product-notfound",
					error: "product-notfound"
				});
			}

			const qrCodeImage = await qrCode.toDataURL(JSON.stringify(productObj));

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
