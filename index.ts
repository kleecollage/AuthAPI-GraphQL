import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AuthAPI } from './datasources/auth-api';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const { cache } = server
    const token = req.headers["x-auth-token"]

    return {
      jwt: token,
      dataSources: {
        authAPI: new AuthAPI({ cache })
      },
    };
  },
});

console.log(`Server start on: ${url}`)