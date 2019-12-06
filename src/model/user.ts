import { Mongoose, Document } from 'mongoose';

export interface MongooseModelUser extends Document {
	email: string;
	username: string;
}

export function userModel(mongoose: Mongoose) {
	return new mongoose.Schema({
		email: {
			type: String,
			// unique: true,
			required: true,
			unique: true,
		},
		username: String,
	});
}
