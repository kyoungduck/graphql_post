import { importSchema } from 'graphql-import';
import { readdirSync } from 'fs';

const schema = importSchema('src/graphql/schema/schema.graphql');

export default schema;
