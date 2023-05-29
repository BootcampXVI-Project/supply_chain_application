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
				message: "successfull!",
				data: image,
				status: "success"
			});
		} catch (err) {
			console.log("ERR", err);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	}
}
