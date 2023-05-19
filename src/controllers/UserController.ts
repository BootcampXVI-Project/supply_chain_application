import {
	evaluateTransaction,
	evaluateTransactionUserObjProductId,
	submitTransaction,
	registerUser
} from "../app";
import { convertBufferToJavasciptObject } from "../helpers";
import { getUserByUserId, getAllUsers } from "../services/crudDatabase/user";
import { Request, Response } from "express";


const UserController = {
	
	signup: async (req: Request, res: Response) => {
		try {

			const { phoneNumber } = req.body;
			console.log(phoneNumber);
			
		
			// Lưu thông tin đăng ký và mã OTP để xác thực sau này
			// Ví dụ: lưu vào cơ sở dữ liệu hoặc biến lưu trữ tạm thời
			user.phone = phoneNumber;
			user.otp = await sendOtp(phoneNumber);
			return res.
			//status(200)
			json({ message: 'OTP sent successfully.' });
		  } catch (error) {
			console.log('Failed to send OTP:', error);
			return res.
			//status(500).
			json({ error: 'Failed to send OTP.' });
		  }
	},

	verify: async (req: Request ,res: Response) => {
		try {
			const { phoneNumber, otp } = req.body;
			  
			// TODO: Lấy thông tin đăng ký và mã OTP từ cơ sở dữ liệu hoặc biến lưu trữ tạm thời
		  	if(user.phone == phoneNumber) {
			  // TODO: Kiểm tra mã OTP có khớp không
	  
			  const isValidOTP = otp === user.otp;
		
			  if (isValidOTP) {
				// Mã OTP hợp lệ, tiến hành xử lý đăng ký
				// Ví dụ: lưu thông tin người dùng vào cơ sở dữ liệu
				return res.status(200).json({ message: 'OTP verified successfully.' + user.otp});
			  } else {
				// Mã OTP không hợp lệ
				return res.status(401).json({ error: 'Invalid OTP.' + user.otp + ' ' + otp  });
			  }
			}
		  } catch (error) {
			console.log('Failed to verify OTP:', error);
			return res.status(500).json({ error: 'Failed to verify OTP.' });
		  }
		},
	// DONE
	createUser: async (req: Request, res: Response) => {
		try {
			const userObj = req.body.userObj;
			const createdUser = await registerUser(userObj);

			return res.json({
				data: createdUser,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	getAllUsers: async (req: Request, res: Response) => {
		try {
			const users = await getAllUsers();

			return res.json({
				data: users,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	getUser: async (req: Request, res: Response) => {
		try {
			const userId = String(req.query.userId);
			const users = await getUserByUserId(userId);

			return res.json({
				data: users,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	}
};

export default UserController;
