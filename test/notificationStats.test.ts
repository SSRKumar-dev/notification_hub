import { calculateNotificationStats } from "../src/services/notificationStats";

describe("calculateNotificationStats", () => {
  it("aggregates totals by notification status", () => {
    const stats = calculateNotificationStats([
      { status: "SENT" },
      { status: "PENDING" },
      { status: "FAILED" },
      { status: "SENT" },
      { status: "PENDING" },
    ]);

    expect(stats).toEqual({
      total: 5,
      sent: 2,
      pending: 2,
      failed: 1,
      unread: 3,
    });
  });
});
