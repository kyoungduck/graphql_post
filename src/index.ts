import express from 'express';
import helmet from 'helmet';
import _ from 'lodash';
import { ApolloServer, gql } from 'apollo-server-express';
import './config';

import resolvers from '@gql/resolver/index';
import typeDefs from '@gql/schema/index';

const path = process.env.GRAPHQL_PATH || '/graphql';
const port = process.env.PORT || 3000;

const app = express();
app.use(helmet());

const server = new ApolloServer({
    typeDefs,
	resolvers,
	context : req => ({locale:'kr'})
});

server.applyMiddleware({app, path});

app.listen(port, () => {
	console.log(`GraphQL Server is now running on http://localhost:${port}/${path}`);
}).on('error', err => {
	if (err.message === `bind EADDRINUSE null:${port}`) {
		console.error(`${port} 포트 바인딩 에러, 포트가 사용되고 있지 않은지 확인하세요`);
	} else {
		throw err;
	}
});
