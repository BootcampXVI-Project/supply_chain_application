import twilio from "twilio";
import { AuthModel } from "../models/AuthModel";

// Set up authentication Twilio
const accountSid = "AC21dec952ef63dfbfeb9d8b9ebcc39629";
const authToken = "a9c9623cafb069c2aa99e9d910fab087";
const twilioPhoneNumber = "+15855493070";

const client = twilio(accountSid, authToken);

export default class AuthService {
	async sendOtp(phoneNumber: string) {
		const digits = "0123456789";
		let otp = "";
		for (let i = 0; i < 6; i++) {
			otp += digits[Math.floor(Math.random() * 10)];
		}

		// Send OTP message using Twilio API
		// const client = twilio(/* Your Twilio credentials here */);
		// const twilioPhoneNumber = "YOUR_TWILIO_PHONE_NUMBER"; // Replace with your Twilio phone number
		const message = await client.messages.create({
			body: `Your OTP is: ${otp}`,
			from: twilioPhoneNumber,
			to: phoneNumber
		});

		return otp;
	}
}
