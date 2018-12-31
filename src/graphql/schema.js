import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './resources/schemas/**')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resources/resolvers/**')));

export {
  typeDefs,
  resolvers
};