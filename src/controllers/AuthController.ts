import { Request, Response } from "express";
import AuthService from "../services/crudDatabase/auth"
import { UserModel } from "../models/UserModel";

export class AuthController{
	authService = AuthService

    login = async (req: Request, res: Response) => {
		try {
			const { phoneNumber, password } = req.body;
			console.log(phoneNumber, password);

            const user = await UserModel.findOne({phone: phoneNumber, password: password})
			user.otp = await this.authService.sendOtp(phoneNumber)
			return res.
			json({ 
				message: 'OTP sent successfully.',
				data: user 
			});
		} catch (err) {

		}
	},
}