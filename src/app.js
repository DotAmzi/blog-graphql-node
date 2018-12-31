import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import db from './db/models';
import { verifyToken } from './middlewares/jwt';
import {typeDefs, resolvers} from './graphql/schema';
const app = express();
const PORT = process.env.PORT || 3000;
const pathUrl = '/graphql';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 5000000
  })
);

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    db: db,
    user: req.user
  }),
  playground: {
    settings: {
      'editor.cursorShape': 'block' // possible values: 'line', 'block', 'underline'
    }
  }
});

app.use(pathUrl, verifyToken);
apollo.applyMiddleware({ app, pathUrl });

let server = app.listen(PORT || 3000, () => {
  console.log(
    `🚀 🚀 🚀 Server ready at http://localhost:${PORT}${
      apollo.graphqlPath
    } 🚀 🚀 🚀`
  );
});

export default {
  server: server,
  app: app
};