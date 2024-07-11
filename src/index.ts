import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();

  app.use(express.json());
  const PORT = Number(process.env.PORT) || 8000;

  const server = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
        type Mutation {
          createUser(  firstName:String!,lastName:String!,email:String!,password:String!): Boolean
        }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello, World!",
        say: (_, { name }: { name: String }) => `Hello, ${name}. How are you?`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "password",
              profileImage: "",
            },
          });
          return true;
        },
      },
    },
  });

  await server.start();

  app.get("/", (req, res) => {
    res.json({ msg: "Welcome to the API" });
  });

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));
}

init();
