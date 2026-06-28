import { kafkaClient } from "./kafkaClient";

const producer = kafkaClient.producer();

export const connectProducer = async () => {
  await producer.connect();
};

export const sendNotificationEvent = async (payload: any) => {
  await producer.send({
    topic: "notifications-topic",
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });
};
