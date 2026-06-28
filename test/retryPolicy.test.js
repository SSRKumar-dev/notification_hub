import { shouldRetryNotification } from "../src/kafka/retryPolicy";
describe("shouldRetryNotification", () => {
    it("retries while the retry count is below the max allowed retries", () => {
        expect(shouldRetryNotification(0, 3)).toBe(true);
        expect(shouldRetryNotification(1, 3)).toBe(true);
        expect(shouldRetryNotification(2, 3)).toBe(true);
        expect(shouldRetryNotification(3, 3)).toBe(false);
    });
});
