import type { QueryResolvers } from "../generated/graphql";
const { getNotificationsService } =
  await import("../services/notification.service");

export const queryResolvers: QueryResolvers = {
  getNotifications: async (
    _parent: unknown,
    _args: unknown,
    { userId }: { userId?: string | null },
  ) => {
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
      retryCount: notification.retryCount ?? 0,
      createdAt: notification.createdAt?.toISOString() ?? "",
      updatedAt: notification.updatedAt?.toISOString() ?? "",
    }));
  },
};
