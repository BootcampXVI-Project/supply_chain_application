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

			const user = await UserModel.findOne({
				phoneNumber: phoneNumber,
				password: password
			})
				.select("-__v -_id -createdAt -updatedAt -password -status")
				.lean();

			if (!user) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}
			if (user.status === "inactive") {
				let otp = await AuthModel.findOne({ phoneNumber: user.phoneNumber });
				if (!otp) {
					let otp: Auth = {
						phoneNumber: phoneNumber,
						otp: await authService.sendOtp(phoneNumber),
						expired: expirationDate
					};
					if (otp.otp == null) {
						return res.json({
							data: null,
							message: "Account not found!",
							error: "account-notfound"
						});
					}
					await AuthModel.create(otp).then((data) => {
						console.log(data);
					});
					return res.json({
						data: null,
						message: "OTP sent successfully!",
						error: null
					});
				}

				otp.otp = await authService.sendOtp(phoneNumber);
				await AuthModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ otp: otp.otp }
				);
				if (otp.otp == null) {
					return res.json({
						data: null,
						message: "Account not found!",
						error: "account-notfound"
					});
				}

				// if (otp.expired < new Date()) {
				// 	otp.otp = await authService.sendOtp(phoneNumber);
				// 	return res.json({
				// data: null,
				// message: "OTP sent successfully!",
				// error: null
				// 	});
				// }

				return res.json({
					data: null,
					message: "OTP sent successfully!",
					error: null
				});
			}

			const payload = { userId: user.userId, role: user.role };
			const token = await authService.generateAccessToken(payload);

			return res.json({
				data: { user: user, token: token },
				message: "Login successfully!",
				error: null
			});
		} catch (error) {
			console.log("error", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}

	async verify(req: Request, res: Response) {
		try {
			const { phoneNumber, smsotp } = req.body;

			let otp = await AuthModel.findOne({ phoneNumber: phoneNumber });
			if (!otp) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
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
					data: null,
					message: "OTP verified successfully!",
					error: null
				});
			}

			return res.json({
				data: null,
				message: "Invalid OTP!",
				error: "failed"
			});
		} catch (error) {
			console.log("error", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}

	async resetPassword(req: Request, res: Response) {
		try {
			const { phoneNumber, isVerified, password } = req.body;

			let user = await UserModel.findOne({ phoneNumber: phoneNumber });
			if (!user) {
				return res.json({
					data: null,
					message: "User not found!",
					error: "user-notfound"
				});
			}

			if (isVerified) {
				user.password = password;
				await UserModel.findOneAndUpdate(
					{ phoneNumber: phoneNumber },
					{ user: user }
				);
				return res.json({
					data: null,
					message: "Reset password successfully!",
					error: null
				});
			}

			let otp = await AuthModel.findOne({ phoneNumber: user.phoneNumber });
			otp.otp = await authService.sendOtp(phoneNumber);
			return res.json({
				data: null,
				message: "OTP sent successfully!",
				error: null
			});
		} catch (error) {
			console.log("error", error.message);
			return res.json({
				data: null,
				message: "failed",
				error: error.message
			});
		}
	}
}
