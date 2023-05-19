import twilio from 'twilio';

// Set up authentication Twilio
const accountSid = 'AC21dec952ef63dfbfeb9d8b9ebcc39629';
const authToken = 'a9c9623cafb069c2aa99e9d910fab087';
const twilioPhoneNumber = '+15855493070';

const client = twilio(accountSid, authToken);

export class userService {
    sendOtp = async (phoneNumber: string) => {
        // Create random otp
        const digits = '0123456789';
        let cotp = '';
        for (let i = 0; i < 6; i++) {
              cotp += digits[Math.floor(Math.random() * 10)];
        }
    
        const otp = cotp;
                // Gửi tin nhắn OTP bằng Twilio API
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: phoneNumber,
        });
    
        return otp;
    }
}