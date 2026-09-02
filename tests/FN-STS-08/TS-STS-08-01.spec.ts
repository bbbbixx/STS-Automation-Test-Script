import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการกรอกข้อมูล : TS-STS-08-01', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL as string);
  });

  test('TC-STS-08-01-01', async ({ page }) => {
  });

  test('TC-STS-08-01-02', async ({ page }) => {
  });

  test('TC-STS-08-01-03', async ({ page }) => {
  });

  test('TC-STS-08-01-04', async ({ page }) => {
  });

});
