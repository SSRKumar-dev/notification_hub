import dotenv from "dotenv";
import { Kafka } from "kafkajs";

dotenv.config();

const brokers = process.env.KAFKA_BROKER
  ? process.env.KAFKA_BROKER.split(",").map((broker) => broker.trim())
  : ["localhost:9092"];

export const kafkaClient = new Kafka({
  clientId: "notification-hub",
  brokers,
});

