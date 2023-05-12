import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("strictQuery", false);

const MONGODB_URI: string = process.env.MONGODB_URI || "";

const connectDatabase = () => {
	try {
		mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true
		} as ConnectOptions);

		mongoose.connection.on("error", (error: string) => {
			console.log("Connect to database failed with error:", error);
			throw new Error(error);
		});

		mongoose.connection.on("open", () => {
			console.log("Connect to database successfully");
		});
	} catch (error: any) {
		console.log("Connect to database failed with error:", error);
		throw new Error(error);
	}
};

export default connectDatabase;
