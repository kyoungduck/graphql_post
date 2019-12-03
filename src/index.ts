import express from 'express';
import helmet from 'helmet';
import _ from 'lodash';
import { ApolloServer } from 'apollo-server-express';

import resolvers from '@gql/resolver/index';
import typeDefs from '@gql/schema/index';

// Initialize environment variables
require('dotenv').config();

const path = process.env.PATH || '/graphql';
const port = process.env.PORT || 3000;

const app = express();
app.use(helmet());

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({app, path});

app.listen(port, () => {
	console.log(`GraphQL Server is now running on http://localhost:${port}/graphql`);
}).on('error', err => {
	if (err.message === `bind EADDRINUSE null:${port}`) {
		console.error(`${port} 포트 바인딩 에러, 포트가 사용되고 있지 않은지 확인하세요`);
	} else {
		throw err;
	}
});
