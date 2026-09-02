import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการทำงานของปุ่ม : TS-STS-01-02', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL as string);
  });

  test('TC-STS-01-02-01', async ({ page }) => {
  });

  test('TC-STS-01-02-02', async ({ page }) => {
  });

  test('TC-STS-01-02-03', async ({ page }) => {
  });

  test('TC-STS-01-02-04', async ({ page }) => {
  });

});
