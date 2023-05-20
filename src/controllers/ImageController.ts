import { Request, Response } from "express";
import ImageService from "../services/crudDatabase/image";

export default class ImageController {
	imageService = ImageService;

	async upload(req: Request, res: Response) {
		try {
			const { imageString, imagePathNameToFirebase } = req.body;

			let image = await this.imageService.upload(
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
