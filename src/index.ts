import "./polyfills";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import authRouter from "./routes/auth";
import { client, connectDb } from "./db";
import { resolvers } from "./resolvers";
import { connectProducer } from "./kafka/producer";
import { startConsumer } from "./kafka/consumer";
import { createTopic } from "./kafka/admin";

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

app.get("/api/notifications/stats", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub?: string;
      userId?: string;
    };

    const userId = decoded.userId || decoded.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { getNotificationStatsService } =
      await import("./services/notification.service");
    const stats = await getNotificationStatsService(userId);
    return res.json(stats);
  } catch (error) {
    console.error("Notification stats fetch failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
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

    await createTopic();
    await connectProducer();
    await startConsumer();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

export { client, app };
