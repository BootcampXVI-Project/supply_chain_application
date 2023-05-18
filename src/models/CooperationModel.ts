import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema, Document, Types } from "mongoose";

interface Cooperation {
	cooperationId: string;
	name: string;
	description: string;
	address: string;
	founderId: string;
	longitude: string;
	latitude: string;
}

interface CooperationDB extends Cooperation, Document {
	_id: Types.ObjectId;
}

const CooperationSchema: Schema<CooperationDB> = new Schema<CooperationDB>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	address: { type: String, required: true },
	founderId: { type: String, required: true },
	longitude: { type: String, required: true },
	cooperationId: { type: String, default: uuidv4() },
	latitude: { type: String }
});

const CooperationModel = mongoose.model<CooperationDB>(
	"Cooperation",
	CooperationSchema
);

export { Cooperation, CooperationDB, CooperationModel };
