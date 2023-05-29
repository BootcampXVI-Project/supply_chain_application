import qrCode from "qrcode";
import { Request, Response } from "express";
import { getUserByUserId } from "../services/crudDatabase/user";
import { getProductById } from "../services/crudDatabase/product";
import { PRODUCTION_URL } from "../constants";

const QRCodeController = {
	generateQRCode: async (req: Request, res: Response) => {
		try {
			const productId = String(req.query.productId);
			const userId = String(req.body.userId);
			const userObj = await getUserByUserId(userId);
			const productObj = await getProductById(productId, userObj);

			if (!productObj) {
				return res.status(404).json({
					data: null,
					message: "product-notfound",
					error: "product-notfound"
				});
			}

			const qrCodeImage = await qrCode.toDataURL(
				`${PRODUCTION_URL}/product/${productId}`
			);

			// save into network or database

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
