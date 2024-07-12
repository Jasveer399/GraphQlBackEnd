import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";
import createGraphQlApolloServer from "./graphql";
import dotenv from "dotenv";
import UserServices from "./services/user.services";

async function init() {
  const app = express();
  dotenv.config();

  app.use(express.json());
  const PORT = Number(process.env.PORT) || 8000;

  app.get("/", (req, res) => {
    res.json({ msg: "Welcome to the API" });
  });

  const server = await createGraphQlApolloServer();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          const user = await UserServices.decodeJWTtoken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));
}

init();
