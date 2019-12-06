import _ from 'lodash';
import { ApolloError } from 'apollo-server';
import { UserModel } from '~/model';

export default {
    Query : {
        user: async (parent: any, args: any, context: any) => {
            const result = await UserModel.findOne({_id: args.id});
            if (result === null) { throw new ApolloError('user not exists', 'BAD_ARGUMENT'); }
            return result;
        },

        userList: async (parent: any, args: any, context: any) => {
            const result = await UserModel.find();
            return result;
        }
    },

    Mutation : {
        createUser: async (parent: any, args: any, context: any) => {
            const user = new UserModel(args.input);
            const result = await user.save();
            return result;
        },

        deleteUser: async (parent: any, args: any, context: any) => {
            const result = await UserModel.deleteOne({_id: args.id});
            if (result.deletedCount! > 0) { return true; }

            return false;
        },

        updateUser: async (parent: any, args: any, context: any) => {
            const result = await UserModel.updateOne({_id : args.input.id}, args.input);
            if (result!.nModified > 0) {
                throw new ApolloError('user not exists', 'BAD_ARGUMENT');
            }

            const updatedUser = await UserModel.findOne({_id: args.input.id});

            return updatedUser;
        }
    }
};
