import { Request, Response } from "express";
import authService from "../services/crudDatabase/auth"
import { UserModel } from "../models/UserModel";

export class AuthController{
    login = async (req: Request, res: Response) => {
		try {
			const { phoneNumber } = req.body;
			console.log(phoneNumber);

            const user = await UserModel.findOne({})
			user.phone = phoneNumber;
			user.otp = await sendOtp(phoneNumber);
			return res.
			//status(200)
			json({ 
				message: 'OTP sent successfully.',
				data: user 
			});
		} catch (err) {

		}
	},
}