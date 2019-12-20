import express from 'express';
import helmet from 'helmet';
import _ from 'lodash';
import { ApolloServer } from 'apollo-server-express';
import {makeExecutableSchema} from 'graphql-tools';
import './config';

import resolvers from '@gql/resolver/index';
import typeDefs from '@gql/schema/index';

import {connect} from './model/index';

import userLoader from './dataloader/userLoader';
import postLoader from './dataloader/postLoader';

const ConstraintDirective = require('graphql-constraint-directive');

const path = process.env.GRAPHQL_PATH || '/graphql';
const port = process.env.PORT || 3000;

const app = express();
app.use(helmet());


const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {constraint: ConstraintDirective}
  }),
  context: req => ({ locale: 'kr', userLoader : userLoader(), postLoader: postLoader() }),
});

server.applyMiddleware({ app, path });

(async () => {
  await connect();
app
  .listen(port, () => {
    console.log(
      `GraphQL Server is now running on http://localhost:${port}/${path}`
    );
  })
  .on('error', err => {
    if (err.message === `bind EADDRINUSE null:${port}`) {
		console.error(
        `${port} 포트 바인딩 에러, 포트가 사용되고 있지 않은지 확인하세요`
      );
    } else {
		throw err;
    }
  });
})().then(() => {});
