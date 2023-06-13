import "firebase/storage";
import QRCode from "qrcode";
import admin from "firebase-admin";
import serviceAccount from "../config/supply-chain-9ea64-firebase-adminsdk-hz2j8-94d0fecb0a.json";
import { FIREBASE_STORAGE_BUCKET } from "../constants";

admin.initializeApp({
	credential: admin.credential.cert({
		privateKey: serviceAccount.private_key,
		clientEmail: serviceAccount.client_email,
		projectId: serviceAccount.project_id
	}),
	storageBucket: FIREBASE_STORAGE_BUCKET
});
const storageBucket = admin.storage().bucket();

class ImageService {
	storage: any;

	upload = async (imagePath: string, imageName: string) => {
		try {
			const currentDate = new Date();
			// Expired after 1 year
			const expirationDate = new Date(
				currentDate.getTime() + 365 * 24 * 60 * 60 * 1000
			);

			const response = await storageBucket.upload(imagePath, {
				destination: imageName
			});
			const url = await response[0].getSignedUrl({
				action: "read",
				expires: expirationDate
			});

			return url[0];
		} catch (error) {
			console.error("Error uploading image:", error);
			return null;
		}
	};

	generateAndPublishQRCode = async (
		encodeData: string,
		imageNamePath: string
	) => {
		try {
			QRCode.toFile("./image.jpg", encodeData, {
				errorCorrectionLevel: "H"
			})
				.then(() => {})
				.catch((error) => {
					throw error;
				});

			return await this.upload("./image.jpg", imageNamePath);
		} catch (error) {
			return null;
		}
	};
}

export default ImageService;
