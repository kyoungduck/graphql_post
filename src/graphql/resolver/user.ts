import _ from 'lodash';
import { ApolloError } from 'apollo-server';
import {GraphQLEmail} from 'graphql-custom-types';
import { UserModel } from '~/model';

export default {
    GraphqlEmail: GraphQLEmail,
    Query : {
        user: async (parent: any, args: any, context: any) => {
            const result = await UserModel.findOne({_id: args.id});
            // const result = await context.userLoader.load(args.id);
            if (result === null) { throw new ApolloError('user not exists', 'BAD_ARGUMENT'); }
            return result;
        },

        userList: async (parent: any, args: any, context: any) => {
            const result = await UserModel.find().skip((args.pageNum - 1) * args.amount).limit(args.amount);
            return result;
        },

        searchUserByEmail: async (parent: any, args: any, context: any) => {
            const result = await UserModel.findOne({email : args.email});
            if (result === null) { throw new ApolloError('user not exists', 'BAD_ARGUMENT'); }
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
        },

        addFriend: async (parent: any, args: any, context: any) => {
            if (args.input.sourceUser === args.input.targetUser) {
                throw new ApolloError('자신을 친구로 추가할수 없습니다', 'bad_argument');
            }

            const friendExists = await UserModel.findOne({_id : args.input.sourceUser, friends : args.input.targetUser });
            if (friendExists) { return friendExists; }

            await UserModel.updateOne({_id : args.input.sourceUser}, { $push : {friends : args.input.targetUser} });

            const targetFriendsExists = await UserModel.findOne({_id : args.input.targetUser, friends : args.input.sourceUser });

            if (targetFriendsExists) { throw new ApolloError('관리자에게 문의하세요', 'db_info_error') }

            await UserModel.updateOne({_id : args.input.targetUser}, { $push : {friends : args.input.sourceUser} });

            const result = await UserModel.findOne({_id : args.input.sourceUser, friends : args.input.targetUser });
            return result;
        },

        deleteFriend: async (parent:any, args:any, context:any) => {
            const friendExists = await UserModel.findOne({_id : args.input.sourceUser, friends : args.input.targetUser });
            if (!friendExists) { throw new ApolloError('친구정보가 존재하지 않습니다', 'no_friends'); }

            await UserModel.updateOne({_id : args.input.sourceUser}, { $pull : {friends : args.input.targetUser} });
            await UserModel.updateOne({_id : args.input.targetUser}, { $pull : {friends : args.input.sourceUser} });

            const result = await UserModel.findOne({_id: args.input.sourceUser});
            return result;
        }

    },

    Post: {
        user: async (parent: any, args: any, context: any) => {
            // const result = await UserModel.findOne({_id: parent.userId});
            const result = await context.userLoader.load(parent.userId);
            return result;
        }
    },

    User: {
        friends: async (parent: any, args: any, context: any) => {
            // const friendList = await UserModel.find({_id : {$in : parent.friends}});
            const friendList = await context.userLoader.loadMany(parent.friends);
            return friendList;
        }
    }
};
