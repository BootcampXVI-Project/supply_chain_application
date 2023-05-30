import ImageService from "../services/imageService";
import { Request, Response } from "express";

const imageService: ImageService = new ImageService();

export default class ImageController {
	async upload(req: Request, res: Response) {
		try {
			const { imageString, imagePathNameToFirebase } = req.body;

			let image = await imageService.upload(
				imageString,
				imagePathNameToFirebase
			);

			return res.json({
				message: "successfull",
				data: image,
				error: null
			});
		} catch (error) {
			return res.json({
				message: "failed",
				data: null,
				error: error.message
			});
		}
	}

	async base64ToPublicImage(req: Request, res: Response) {
		try {
			const { base64String, imageString } = req.body;

			const publicImageUrl = await imageService.base64ToPublicImage(
				base64String,
				imageString
			);

			return res.json({
				message: "successfull",
				data: publicImageUrl,
				error: null
			});
		} catch (error) {
			return res.json({
				message: "failed",
				data: null,
				error: error.message
			});
		}
	}
}
