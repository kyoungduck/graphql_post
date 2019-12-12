import { Mongoose, Document } from 'mongoose';

export interface MongooseModelUser extends Document {
	email: string;
	username: string;
	friends: string[];
}

export function userModel(mongoose: Mongoose) {
	const {ObjectId} = mongoose.Types;

	return new mongoose.Schema({
		email: {
			type: String,
			required: true,
			unique: true,
		},
		username: String,
		friends: {
			type: [ObjectId],
			default : [],
		}
	});
}
