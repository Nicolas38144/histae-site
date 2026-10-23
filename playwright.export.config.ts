import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", testMatch: "export-security.spec.ts", workers: 1,
  use: { baseURL: "http://127.0.0.1:3113", headless: true, channel: process.env.PLAYWRIGHT_CHANNEL },
  webServer: {
    command: "node tests/serve-export.mjs", url: "http://127.0.0.1:3113/fr/",
    reuseExistingServer: false, timeout: 15000,
  },
});
