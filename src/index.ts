import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cluster from 'express-cluster';
import helmet from 'helmet';
import _ from 'lodash';

// Initialize environment variables
require('dotenv').config();

cluster(
  worker => {
    const app = express();

    app.use(helmet());
  },
  process.env.NODE_ENV === 'development' ? { count: 1 } : {}
);
