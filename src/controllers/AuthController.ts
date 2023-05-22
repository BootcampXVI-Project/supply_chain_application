import AuthService from "../services/crudDatabase/auth";
import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { AuthModel } from "../models/AuthModel";

export default class AuthController {
	authService = AuthService;

	async login(req: Request, res: Response) {
		try {
			const { phoneNumber, password } = req.body;
			console.log(phoneNumber, password);

			const user = await UserModel.findOne({
				phoneNumber: phoneNumber,
				password: password
			});
			if (!user) {
				return res.json({
					message: "user not found",
					status: "failed"
				});
			}
			let otp = await AuthModel.findOne({ phoneNumber: user.phoneNumber });
			if (user.status === "inactive") {
				otp.otp = await this.authService.sendOtp(phoneNumber);
				return res.json({
					message: "OTP sent successfully.",
					status: "verifying"
				});
			}

			// if (otp.expired < Date.now()) {
			// 	otp.otp = await this.authService.sendOtp(phoneNumber);
			// 	return res.json({
			// 		message: "OTP sent successfully.",
			// 		status: "verifying"
			// 	});
			// }
			return res.json({
				message: "Login successful",
				status: "login"
			});
		} catch (err) {
			console.log("ERR", err);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	}
	async verify(req: Request, res: Response) {
		try {
			const { phoneNumber, smsotp } = req.body;

			let otp = await AuthModel.findOne({ phoneNumber: phoneNumber });
			if (!otp) {
				return res.json({
					message: "user not found",
					status: "failed"
				});
			}

			if (otp.otp === smsotp) {
				const currentDate = new Date();
				const expirationDate = new Date(
					currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
				);

				otp.expired = expirationDate;

				await AuthModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ otp: otp }
				);

				return res.json({
					message: "OTP verified successfully.",
					status: "verified"
				});
			}

			return res.json({
				message: "Invalid OTP.",
				status: "FailedVerified"
			});
		} catch (err) {
			console.log("ERR", err);
			return res.json({
				message: "failed",
				status: "failed"
			});
		}
	}

	async resetPassword(req: Request, res: Response) {
		try {
			const { phoneNumber, isVerified, password } = req.body;

			let user = await UserModel.findOne({ phoneNumber: phoneNumber });
			if (!user) {
				return res.json({
					message: "user not found",
					status: "failed"
				});
			}

			if (isVerified) {
				user.password = password;
				await UserModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ user: user }
				);
				return res.json({
					message: "Reset password successfull!",
					status: "reseted"
				});
			}

			let otp = await AuthModel.findOne({ phoneNumber: user.phoneNumber });
			otp.otp = await this.authService.sendOtp(phoneNumber);
			return res.json({
				message: "OTP sent successfully.",
				status: "verifying"
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