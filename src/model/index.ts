import { Mongoose } from 'mongoose';
import {MongooseModelUser, userModel} from './user';
import {MongooseModelPost, postModel} from './post';

const URI = process.env.MONGO_URI || 'localhost'; // your mongodb uri
const DB = process.env.MONGO_DB || 'test'; // your db

const mongoose = new Mongoose();

mongoose.set('useCreateIndex', true);
//mongoose.set('debug', true);

export const connect = async () => {
    await mongoose.connect(`mongodb://${URI}/${DB}`, { useUnifiedTopology: true, useNewUrlParser: true });
};


export const UserModel = mongoose.model<MongooseModelUser>('user', userModel(mongoose));
export type UserModelType = MongooseModelUser;

export const PostModel = mongoose.model<MongooseModelPost>('post', postModel(mongoose));
export type PostModelType = MongooseModelPost;

export const {ObjectId} = mongoose.Types;
