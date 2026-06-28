import type { MutationResolvers } from "../generated/graphql";
import { createNotificationService } from "../services/notification.service";

export const mutationResolvers: MutationResolvers = {
  createNotification: async (
    _parent: unknown,
    args: {
      input: { message: string; recipient: string; type?: string | null };
    },
    context: { userId?: string | null },
  ) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }

    const notification = await createNotificationService(
      context.userId,
      args.input,
    );

    return {
      id: String(notification._id),
      userId: String(notification.userId),
      recipient: notification.recipient,
      type: notification.type,
      message: notification.message,
      status: notification.status,
      retryCount: notification.retryCount,
      createdAt: notification.createdAt?.toISOString() ?? "",
      updatedAt: notification.updatedAt?.toISOString() ?? "",
    };
  },
};
