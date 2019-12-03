import { formatError } from 'apollo-errors';
import _ from 'lodash';
import { ApolloError } from 'apollo-server';

export default {
    Query : {
        auth : (parant: any, args: any, context: any) => {
            console.log('auth called');
            context.auth = 'logined';
            return true;
        },

        afterAuth : (parant: any, args: any, context: any) => {
            console.log(context);
            return 'test';
        }
    }
};
