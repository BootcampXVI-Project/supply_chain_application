import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const ObjectId = mongoose.Types.ObjectId;
export const PORT = process.env.PORT || 4000;
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DEVELOPMENT_URL = `http://localhost:${PORT}`;
export const PRODUCTION_URL = process.env.PRODUCTION_URL;
export const HOST_URL =
	NODE_ENV === "development" ? DEVELOPMENT_URL : PRODUCTION_URL;
export const SWAGGER_URL = `${HOST_URL}/api-docs/`;
export const FIREBASE_STORAGE_BUCKET =
	process.env.FIREBASE_STORAGE_BUCKET || "";
export const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "admin";
export const ADMIN_USER_PASSWORD = process.env.ADMIN_USER_PASSWORD || "adminpw";
export const CHANNEL_NAME = process.env.CHANNEL_NAME || "supplychain-channel";
export const CHAINCODE_NAME = process.env.CHAINCODE_NAME || "basic";
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
export const EXPIRES_IN = process.env.EXPIRES_IN || 0;
export const ACCOUNT_SID = process.env.ACCOUNT_SID || "";
export const AUTH_TOKEN = process.env.AUTH_TOKEN || "";
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
