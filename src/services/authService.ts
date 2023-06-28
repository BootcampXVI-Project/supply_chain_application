import twilio from "twilio";
import jwt from "jsonwebtoken";
import pkg from "bcryptjs";
import UserService from "./userService";
import { TokenPayload } from "../types/models";
import { Request, Response, NextFunction } from "express";
import {
	ACCOUNT_SID,
	AUTH_TOKEN,
	TWILIO_PHONE_NUMBER,
	JWT_SECRET_KEY,
	EXPIRES_IN
} from "../constants";

const { hashSync, compareSync, genSaltSync } = pkg;
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
const userService: UserService = new UserService();

class AuthService {
	sendOtp = async (phoneNumber: string) => {
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
	};

	generateAccessToken = async (payload: TokenPayload) => {
		const expiresIn = EXPIRES_IN + `m`;
		const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
		return token;
	};

	hashPassword = async (password: string, salt = 10) => {
		return hashSync(password, genSaltSync(salt));
	};

	comparePassword = async (password: string, passwordHash: string) => {
		return compareSync(password, passwordHash);
	};

	decodeToken = async (token: string) => {
		return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
	};

	checkTokenExpired = async (token: string) => {
		const decodeTokenValue = await this.decodeToken(token);
		const tokenExpireTime = decodeTokenValue.exp;
		const currentTimestamp = Math.floor(Date.now() / 1000);

		if (tokenExpireTime < currentTimestamp) return false;
		else return true;
	};

	authenticate = async (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// verify token
		const decodeTokenValue = await this.decodeToken(token);
		const isExistedUser = await userService.checkExistedUserId(
			decodeTokenValue.userId
		);
		if (!isExistedUser) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// check expired token and refresh
		const isTokenExpired = await this.checkTokenExpired(token);
		if (isTokenExpired) {
			this.refreshToken(token, (err, newToken) => {
				if (err) {
					return res.status(401).json({ message: "Unauthorized" });
				}
				res.setHeader("Authorization", newToken);
				next();
			});
		} else {
			next();
		}
	};

	refreshToken = async (
		token: string,
		callback: (err: Error | null, newToken?: string) => void
	) => {
		const oldTokenValue = await this.decodeToken(token);
		const { role, userId, userName, phoneNumber } = oldTokenValue;

		const newTokenPayload = {
			role,
			userId,
			userName,
			phoneNumber
		};
		const newToken = await this.generateAccessToken(newTokenPayload);

		callback(null, newToken);
	};
}

export default AuthService;
