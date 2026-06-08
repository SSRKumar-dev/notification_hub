import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import authRouter from "./routes/auth";
import { client, connectDb } from "./db";
import { resolvers } from "./resolvers";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const typeDefs = readFileSync(
  "./src/schema/notificationSchema.graphql",
  "utf8",
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    await server.start();
    app.use(
      "/api/notifications",
      expressMiddleware(server, {
        context: async ({ req }: { req: express.Request }) => {
          const authHeader = req.headers.authorization;

          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return { userId: null };
          }

          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
          ) as {
            sub?: string;
            userId?: string;
          };

          return { userId: decoded.userId || decoded.sub || null };
        },
      }),
    );

    await connectDb();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

export { client, app };
