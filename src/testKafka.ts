import { createTopic } from "./kafka/admin";
import { connectProducer, sendNotificationEvent } from "./kafka/producer";
import { startConsumer } from "./kafka/consumer";

async function main() {
  await createTopic();

  await startConsumer();

  await connectProducer();

  await sendNotificationEvent({
    recipient: "test@gmail.com",
    message: "Hello Kafka",
  });
}

main();
