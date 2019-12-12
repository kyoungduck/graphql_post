import { ApolloError } from 'apollo-server';
import _ from 'lodash';
import { PostModel, UserModel } from '~/model'

export default {
    Query: {
        post: async (parent: any, args: any, context: any) => {
            const result = await PostModel.findOne({_id : args.id});
            if (result === null) { throw new ApolloError('post not exists', 'BAD_ARGUMENT'); }
            return result;
        },

        postList: async (parent: any, args: any, context: any) => {
            const result = await PostModel.find().skip((args.pageNum - 1) * args.amount).limit(args.amount);
            return result;
        }
    },

    Mutation: {
        createPost: async (parent: any, args: any, context: any) => {
            const post = new PostModel(args.input);
            const reuslt = await post.save();
            return reuslt;
        },

        deletePost: async (parent: any, args: any, context: any) => {
            const result = await PostModel.deleteOne({_id : args.id});
            if (result.deletedCount! > 0) { return true; }

            return false;
        },

        updatePost: async (parent: any, args: any, context: any) => {
            const result = await PostModel.updateOne({_id : args.input.id}, args.input);

            if (result!.nModified > 0) {
                throw new ApolloError('post not exists', 'BAD_ARGUMENT');
            }

            const updatedUser = await PostModel.findOne({_id: args.input.id});

            return updatedUser;
        }
    },

    User: {
        writePost: async (parent: any, args: any, context: any) => {
            const result = await PostModel.find({userId: parent.id});
            //const result = await context.postLoader.load(parent.id);

            return result;
        }
    }
}
