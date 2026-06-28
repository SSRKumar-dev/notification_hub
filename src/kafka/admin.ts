import {kafkaClient} from './kafkaClient';

export const createTopic = async () => {
  const admin = kafkaClient.admin();

  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: "notifications-topic",
      },
    ],
  });

  await admin.disconnect();
};