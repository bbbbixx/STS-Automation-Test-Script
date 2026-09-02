import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการแสดงผล : TS-STS-11-03', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL as string);
  });

  test('TC-STS-11-03-01', async ({ page }) => {
  });

  test('TC-STS-11-03-02', async ({ page }) => {
  });

  test('TC-STS-11-03-03', async ({ page }) => {
  });

  test('TC-STS-11-03-04', async ({ page }) => {
  });

});
