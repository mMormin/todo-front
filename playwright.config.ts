import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // Run tests sequentially (single worker) to avoid DB conflicts
  workers: 1,
  // Retry once on failure to handle flaky network timing
  retries: 1,
  use: {
    baseURL: "http://localhost:5173",
    // Keep browser open on failure for debugging
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
