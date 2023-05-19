import mongoose, { Schema, Document, Types } from "mongoose";

interface Auth {
    phoneNumber: string,
	otp: string,
    expired: Date
}

interface AuthDB extends Auth, Document {
	_id: Types.ObjectId;
}


const AuthSchema: Schema<AuthDB> = new Schema<AuthDB>({
    phoneNumber: { type: String, required: true },
	otp: { type: String, require: true },
    expired: { type: Date, require: true },
});

const AuthModel = mongoose.model<AuthDB>("Auth", AuthSchema);

export { Auth, AuthDB, AuthModel }