import { CreateNotificationInput } from "../generated/graphql";
import Notification, {
  connectNotificationDb,
} from "../schema/notificationSchema";



export async function createNotificationService(
  userId: string,
  input: CreateNotificationInput,
) {
  await connectNotificationDb();

  return Notification.create({
    userId,
    recipient: input.recipient,
    message: input.message,
    type: input.type || "EMAIL",
    status: "PENDING",
  });
}

export async function getNotificationsService(userId: string) {
  await connectNotificationDb();  
  return Notification.find({ userId }).sort({ createdAt: -1 });
}
