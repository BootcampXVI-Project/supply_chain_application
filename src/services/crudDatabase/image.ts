import admin from "firebase-admin";
import serviceAccount from "../../config/supply-chain-9ea64-firebase-adminsdk-hz2j8-94d0fecb0a.json";

admin.initializeApp({
	credential: admin.credential.cert({
		privateKey: serviceAccount.private_key,
		clientEmail: serviceAccount.client_email,
		projectId: serviceAccount.project_id,
	}),
	storageBucket: "gs://supply-chain-9ea64.appspot.com"
});

const bucket = admin.storage().bucket();

export default class ImageService {
	static async upload(imagePath: string, nameImage: string) {
		try {
			const currentDate = new Date();
			const expirationDate = new Date(
				currentDate.getTime() + 365 * 24 * 60 * 60 * 1000
			);

			const response = await bucket.upload(imagePath, {
				destination: nameImage
			});

			const url = await response[0].getSignedUrl({
				action: "read",
				// Adjust the expiration date as desired
				expires: expirationDate
			});
			console.log("Image uploaded successfully.");
			return url[0];
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	}
}
