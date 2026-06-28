import { processNotificationMessage } from "../src/kafka/consumer";
describe("processNotificationMessage", () => {
    it("marks the notification as SENT when the email send succeeds", async () => {
        const updates = [];
        const result = await processNotificationMessage({
            notificationId: "notif-1",
            recipient: "user@example.com",
            message: "Hello",
            type: "EMAIL",
        }, {
            sendEmail: async () => undefined,
            updateNotification: async (id, update) => {
                updates.push({ id, update });
            },
            publishNotification: async () => undefined,
            delay: async () => undefined,
        });
        expect(result.status).toBe("SENT");
        expect(updates).toEqual([
            {
                id: "notif-1",
                update: { status: "SENT", retryCount: 0 },
            },
        ]);
    });
    it("retries and marks the notification as PENDING when the email send fails before max retries", async () => {
        const updates = [];
        const result = await processNotificationMessage({
            notificationId: "notif-2",
            recipient: "user@example.com",
            message: "Hello",
            type: "EMAIL",
            retryCount: 1,
        }, {
            sendEmail: async () => {
                throw new Error("smtp down");
            },
            updateNotification: async (id, update) => {
                updates.push({ id, update });
            },
            publishNotification: async () => undefined,
            delay: async () => undefined,
            maxRetries: 3,
        });
        expect(result.status).toBe("PENDING");
        expect(result.retryCount).toBe(2);
        expect(updates).toEqual([
            {
                id: "notif-2",
                update: { retryCount: 2, status: "PENDING" },
            },
        ]);
    });
});
