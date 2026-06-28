export function shouldRetryNotification(
  retryCount: number,
  maxRetries: number,
) {
  return retryCount < maxRetries;
}

export function getRetryDelayMs(retryCount: number, baseDelayMs = 1000) {
  return baseDelayMs * Math.pow(2, retryCount);
}
