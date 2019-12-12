import { Mongoose, Document } from 'mongoose';

export interface MongooseModelPost extends Document {
	title: string;
    content: string;
    userId : string;
}

export function postModel(mongoose: Mongoose) {
    const ObjectID = mongoose.Schema.Types.ObjectId;

	return new mongoose.Schema({
		title: {
			type: String,
		},
        content: String,

        userId: {
            type: ObjectID,
            required: true,
            index: true,
            ref: 'user'
        }
	});
}
