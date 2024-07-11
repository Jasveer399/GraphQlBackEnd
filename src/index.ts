import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

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
    `,
    resolvers: {
      Query: {
        hello: () => "Hello, World!",
        say: (_, { name }: { name: String }) => `Hello, ${name}. How are you?`,
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
