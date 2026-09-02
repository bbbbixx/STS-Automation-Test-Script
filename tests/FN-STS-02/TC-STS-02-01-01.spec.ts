import { test, expect } from '@playwright/test';

test('Default Test Case', async ({ page }) => {
  // TODO: Add test steps
  await page.goto((process.env.TARGET_URL as string));

});
