import { ApolloError } from 'apollo-server';
import _ from 'lodash';
import { PostModel, UserModel } from '~/model'

export default {
    Query: {
        post: async (parent: any, args: any, context: any) => {
            const result = await PostModel.findOne({_id : args.id});
            if (result === null) { throw new ApolloError('post not exists', 'BAD_ARGUMENT'); }
            _.merge(result, {user: await UserModel.findOne({_id : result.userId}) });
            return result;
        },

        postList: async (parent: any, args: any, context: any) => {
            const result = await PostModel.find();
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
    }
}
