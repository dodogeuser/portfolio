import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    use: { baseURL: 'http://127.0.0.1:4173/portfolio/', browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL },
    webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4173/portfolio/', reuseExistingServer: !process.env.CI },
});
