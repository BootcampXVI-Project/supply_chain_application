import twilio from "twilio";
import jwt from "jsonwebtoken";
import pkg from "bcryptjs";
import {
	ACCOUNT_SID,
	AUTH_TOKEN,
	TWILIO_PHONE_NUMBER,
	JWT_SECRET_KEY,
	EXPIRES_IN
} from "../constants";
import { TokenPayload } from "../types/common";

const { hashSync, compareSync, genSaltSync } = pkg;
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

export default class AuthService {
	async sendOtp(phoneNumber: string) {
		const digits = "0123456789";
		let otp = "";

		for (let i = 0; i < 6; i++) {
			otp += digits[Math.floor(Math.random() * 10)];
		}
		const message = await client.messages.create({
			body: `Your OTP is: ${otp}`,
			from: TWILIO_PHONE_NUMBER,
			to: phoneNumber
		});

		return otp;
	}

	async generateAccessToken(payload: TokenPayload) {
		const expiresIn = EXPIRES_IN + `m`;
		const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
		return token;
	}

	async hashPassword(password: string, salt = 10) {
		return hashSync(password, genSaltSync(salt));
	}

	async comparePassword(password: string, passwordHash: string) {
		return compareSync(password, passwordHash);
	}

	async decodeToken(token: string) {
		return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
	}
}
