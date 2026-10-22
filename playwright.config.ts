import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", workers: 1, fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:3107", headless: true },
  webServer: { command: "pnpm dev --hostname 127.0.0.1 --port 3107", url: "http://127.0.0.1:3107/fr/billing/subscribe/", reuseExistingServer: false, timeout: 120000 },
});
