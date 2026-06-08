import type { QueryResolvers } from "../generated/graphql";
const { getNotificationsService } = await import("../services/notification.service");

export const queryResolvers: QueryResolvers = {
  getNotifications: async (_parent, _args, { userId }) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const notifications = await getNotificationsService(userId);
    return notifications.map((notification) => ({
      id: String(notification._id),
      userId: String(notification.userId),
      recipient: notification.recipient,
      message: notification.message,
      type: notification.type,
      status: notification.status,
      createdAt: notification.createdAt,
    }));
  }
};
