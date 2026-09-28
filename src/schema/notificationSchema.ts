import "../polyfills";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["EMAIL"],
      default: "EMAIL",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export async function connectNotificationDb() {
  if (!process.env.url) {
    throw new Error("MongoDB connection string is not set in process.env.url");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.url, {
    dbName: process.env.DB_NAME || "notification_hub",
  });
}

export default mongoose.models.notifications ||
  mongoose.model("notifications", notificationSchema);
