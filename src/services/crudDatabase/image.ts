import admin from "firebase-admin";

// Path to your Firebase service account key file
import serviceAccount from "../../config/supply-chain-9ea64-firebase-adminsdk-hz2j8-94d0fecb0a.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: "gs://supply-chain-9ea64.appspot.com"
	// Add any other configuration options here
});

const bucket = admin.storage().bucket();

export default class ImageService {
	static async upload(imagePath: string, nameImage: string) {
		try {
			const currentDate = new Date();
			const expirationDate = new Date(
				currentDate.getTime() + 365 * 24 * 60 * 60 * 1000
			);
			console.log(imagePath, nameImage);

			const response = await bucket.upload(imagePath, {
				destination: nameImage
			});

			const url = await response[0].getSignedUrl({
				action: "read",
				expires: expirationDate // Adjust the expiration date as desired
			});
			console.log("Image uploaded successfully.");
			return url;
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	}
}
