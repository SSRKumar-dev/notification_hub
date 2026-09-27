import { CreateNotificationInput } from "../generated/graphql";
import Notification, {
  connectNotificationDb,
} from "../schema/notificationSchema";
import { sendNotificationEvent } from "../kafka/producer";
import {
  calculateNotificationStats,
  type NotificationStatusSummary,
} from "./notificationStats";

export type { NotificationStatusSummary };
export { calculateNotificationStats };

export async function createNotificationService(
  userId: string,
  input: CreateNotificationInput,
) {
  await connectNotificationDb();

  const notification = await Notification.create({
    userId,
    recipient: input.recipient,
    message: input.message,
    type: input.type || "EMAIL",
    status: "PENDING",
  });

  await sendNotificationEvent({
    notificationId: String(notification._id),
    userId,
    recipient: notification.recipient,
    message: notification.message,
    type: notification.type,
  });

  return notification;
}

export async function getNotificationsService(userId: string) {
  await connectNotificationDb();
  return Notification.find({ userId }).sort({ createdAt: -1 });
}

export async function getNotificationStatsService(userId: string) {
  await connectNotificationDb();
  const notifications = await Notification.find({ userId }).lean();
  return calculateNotificationStats(notifications);
}
