import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const ObjectId = mongoose.Types.ObjectId;

export const MONGODB_URI = process.env.MONGODB_URI || "";
export const PORT = process.env.PORT || 4000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const DEVELOPMENT_URL = `http://localhost:${PORT}`;
export const PRODUCTION_URL = process.env.PRODUCTION_URL;
export const HOST_URL =
	NODE_ENV === "development" ? DEVELOPMENT_URL : PRODUCTION_URL;
export const SWAGGER_URL = `${HOST_URL}/api-docs/`;
