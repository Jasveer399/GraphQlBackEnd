import { ApolloServer } from "@apollo/server";
import { User } from "./user";

const createGraphQlApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs: `
    ${User.typedef}
      type Query {
        ${User.queries}
      }
        type Mutation {
        ${User.mutationTypeDefs}
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
      },
    },
  });

  await server.start();
  return server;
};

export default createGraphQlApolloServer;
