import ImageService from "../services/imageService";
import { Request, Response } from "express";

const imageService: ImageService = new ImageService();

const ImageController = {
	upload: async (req: Request, res: Response) => {
		try {
			const { imageString, imagePathNameToFirebase } = req.body;

			let image = await imageService.upload(
				imageString,
				imagePathNameToFirebase
			);

			return res.status(200).json({
				message: "successfully",
				data: image,
				error: null
			});
		} catch (error) {
			return res.status(400).json({
				message: "failed",
				data: null,
				error: error.message
			});
		}
	},

	generateAndPublishQRCode: async (req: Request, res: Response) => {
		try {
			const { qrCodeEncodeData, storageImageNamePath } = req.body;

			const publicImageUrl = await imageService.generateAndPublishQRCode(
				qrCodeEncodeData,
				storageImageNamePath
			);

			return publicImageUrl
				? res.status(200).json({
						message: "successfully",
						data: publicImageUrl,
						error: null
				  })
				: res.status(400).json({
						message: "failed",
						data: null,
						error: null
				  });
		} catch (error) {
			return res.status(400).json({
				message: "failed",
				data: null,
				error: error.message
			});
		}
	}
};

export default ImageController;
