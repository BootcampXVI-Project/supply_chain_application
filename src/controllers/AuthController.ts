import AuthService from "../services/authService";
import { Request, Response } from "express";
import { Auth } from "../types/models";
import { UserModel } from "../models/UserModel";
import { AuthModel } from "../models/AuthModel";

const authService: AuthService = new AuthService();

export default class AuthController {
	async login(req: Request, res: Response) {
		try {
			const { phoneNumber, password } = req.body;
			const currentDate = new Date();
			const expirationDate = new Date(
				currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
			);
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
			if (!otp) {
				console.log("DEBUG");
				let otp: Auth = {
					phoneNumber: phoneNumber,
					otp: await authService.sendOtp(phoneNumber),
					expired: expirationDate
				};
				if (otp.otp == null) {
					return res.json({
						message: "Account not found!",
						status: "notfound"
					});
				}
				await AuthModel.create(otp).then((data) => {
					console.log(data);
				});
				return res.json({
					message: "OTP sent successfully.",
					status: "verifying"
				});
			}
			if (user.status === "inactive") {
				otp.otp = await authService.sendOtp(phoneNumber);
				await AuthModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ otp: otp.otp }
				);
				if (otp.otp == null) {
					return res.json({
						message: "Account not found!",
						status: "notfound"
					});
				}
				return res.json({
					message: "OTP sent successfully.",
					status: "verifying"
				});
			}

			if (otp.expired < new Date()) {
				otp.otp = await authService.sendOtp(phoneNumber);
				return res.json({
					message: "OTP sent successfully.",
					status: "verifying"
				});
			}
			return res.json({
				data: user,
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

				await AuthModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{
						expired: expirationDate,
						otp: ""
					}
				);

				await UserModel.findOneAndUpdate(
					{
						phoneNumber: phoneNumber
					},
					{
						status: "active"
					}
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
			otp.otp = await authService.sendOtp(phoneNumber);
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
