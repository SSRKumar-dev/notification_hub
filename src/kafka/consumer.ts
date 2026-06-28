import { type EachMessagePayload } from "kafkajs";
import { kafkaClient } from "./kafkaClient";
import { sendEmailNotification } from "../services/email.service";
import { getRetryDelayMs, shouldRetryNotification } from "./retryPolicy";
import { sendNotificationEvent } from "./producer";

const consumer = kafkaClient.consumer({
  groupId: "notification-group",
});

export interface NotificationMessagePayload {
  notificationId: string;
  userId?: string;
  recipient?: string;
  email?: string;
  message: string;
  type: string;
  retryCount?: number;
}

export interface NotificationProcessorDependencies {
  sendEmail: (payload: {
    notificationId: string;
    userId: string;
    recipient: string;
    message: string;
    type: string;
  }) => Promise<void>;
  updateNotification: (
    id: string,
    update: Record<string, unknown>,
  ) => Promise<void>;
  publishNotification: (payload: NotificationMessagePayload) => Promise<void>;
  delay?: (ms: number) => Promise<void>;
  maxRetries?: number;
}

export async function processNotificationMessage(
  payload: NotificationMessagePayload,
  deps: NotificationProcessorDependencies,
) {
  const recipient = (payload.recipient || payload.email || "").trim();
  if (!recipient) {
    throw new Error(
      `Notification payload missing recipient; payload=${JSON.stringify(payload)}`,
    );
  }

  console.log(
    "Processing notification event",
    JSON.stringify({
      notificationId: payload.notificationId,
      recipient,
      message: payload.message,
      type: payload.type,
    }),
  );

  try {
    await deps.sendEmail({
      notificationId: payload.notificationId,
      userId: payload.userId ?? "",
      recipient,
      message: payload.message,
      type: payload.type,
    });

    await deps.updateNotification(payload.notificationId, {
      status: "SENT",
      retryCount: 0,
    });

    console.log(`Email sent to ${recipient}`);
    return { status: "SENT" as const };
  } catch (error) {
    console.error("Failed to process notification message:", error);

    const currentRetryCount = payload.retryCount ?? 0;
    const nextRetryCount = currentRetryCount + 1;

    if (shouldRetryNotification(nextRetryCount, deps.maxRetries ?? 3)) {
      const delayMs = getRetryDelayMs(nextRetryCount);
      console.log(
        `Retrying notification ${payload.notificationId} in ${delayMs}ms (attempt ${nextRetryCount})`,
      );

      if (deps.delay) {
        await deps.delay(delayMs);
      } else {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      await deps.publishNotification({
        ...payload,
        retryCount: nextRetryCount,
      });

      await deps.updateNotification(payload.notificationId, {
        retryCount: nextRetryCount,
        status: "PENDING",
      });

      return { status: "PENDING" as const, retryCount: nextRetryCount };
    }

    await deps.updateNotification(payload.notificationId, {
      status: "FAILED",
      retryCount: nextRetryCount,
    });

    return { status: "FAILED" as const, retryCount: nextRetryCount };
  }
}

export const startConsumer = async () => {
  const { connectNotificationDb } =
    await import("../schema/notificationSchema");
  await connectNotificationDb();
  await consumer.connect();

  await consumer.subscribe({
    topic: "notifications-topic",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (!message.value) {
        return;
      }

      const payload = JSON.parse(
        message.value.toString(),
      ) as NotificationMessagePayload;

      const { default: Notification } =
        await import("../schema/notificationSchema");

      await processNotificationMessage(payload, {
        sendEmail: sendEmailNotification,
        updateNotification: async (id, update) => {
          await Notification.findByIdAndUpdate(id, update);
        },
        publishNotification: async (notificationPayload) => {
          await sendNotificationEvent(notificationPayload);
        },
      });
    },
  });
};
