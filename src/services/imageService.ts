import "firebase/storage";
import * as fs from "fs";
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
const storageRef = storageBucket;

export default class ImageService {
	async upload(imagePath: string, imageName: string) {
		// try {
		// 	const currentDate = new Date();
		// 	const expirationDate = new Date(
		// 		currentDate.getTime() + 365 * 24 * 60 * 60 * 1000
		// 	);
		// 	const response = await storageBucket.upload(imagePath, {
		// 		destination: imageName
		// 	});
		// 	const url = await response[0].getSignedUrl({
		// 		action: "read",
		// 		expires: expirationDate
		// 	});
		// 	console.log("Image uploaded successfully.");
		// 	return url[0];
		// } catch (error) {
		// 	console.error("Error uploading image:", error);
		// }
	}

	async base64ToPublicImage(base64String: string, imageName: string) {
		// Reference to Firebase Storage file
		const imageRef = storageRef.file(`qrcode/${imageName}.jpg`);

		// Base64 string to Buffer
		const byteCharacters = atob(base64String);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const buffer = Buffer.from(byteArray);

		// Write Buffer to temporary file
		const tempFilePath = `./temp/${imageName}.jpg`;
		fs.writeFileSync(tempFilePath, buffer);

		// Upload temporary file to Firebase Storage
		const uploadTask = imageRef.save(tempFilePath, {
			metadata: {
				contentType: "image/jpeg"
			}
		});

		const publicUrl = await uploadTask
			.then(() => {
				imageRef
					.getSignedUrl({ action: "read", expires: "03-09-2023" })
					.then((urls: string[]) => {
						console.log("Image uploaded successfully!", urls[0]);
						return publicUrl;
					});
			})
			.catch((error: any) => {
				console.error("Error uploading image:", error);
			});

		return publicUrl;
	}
}
