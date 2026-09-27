export interface NotificationStatusSummary {
  total: number;
  sent: number;
  pending: number;
  failed: number;
  unread: number;
}

export function calculateNotificationStats(
  notifications: Array<{ status?: string | null }>,
): NotificationStatusSummary {
  const total = notifications.length;
  const summary = notifications.reduce(
    (acc, notification) => {
      const status = notification.status ?? "PENDING";

      if (status === "SENT") acc.sent += 1;
      if (status === "PENDING") acc.pending += 1;
      if (status === "FAILED") acc.failed += 1;

      return acc;
    },
    { sent: 0, pending: 0, failed: 0 },
  );

  return {
    total,
    sent: summary.sent,
    pending: summary.pending,
    failed: summary.failed,
    unread: summary.pending + summary.failed,
  };
}
