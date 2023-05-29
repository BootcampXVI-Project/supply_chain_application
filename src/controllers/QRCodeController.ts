import qrCode from "qrcode";
import { Request, Response } from "express";
import { PRODUCTION_URL } from "../constants";
import { getUserByUserId } from "../services/userService";
import { getProductById } from "../services/productService";

const QRCodeController = {
	generateQRCode: async (req: Request, res: Response) => {
		try {
			const productId = String(req.query.productId);
			const userId = String(req.body.userId);
			const userObj = await getUserByUserId(userId);
			const productObj = await getProductById(productId, userObj);

			if (!userObj) {
				return res.status(404).json({
					data: null,
					message: "user-notfound",
					error: "user-notfound"
				});
			}
			if (!productObj) {
				return res.status(404).json({
					data: null,
					message: "product-notfound",
					error: "product-notfound"
				});
			}

			const qrCodeImage = await qrCode.toDataURL(
				`${PRODUCTION_URL}/product/detail?productId=${productId}&userId=${userId}`
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
