import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการแสดงผล : TS-STS-08-03', () => {

  test.beforeEach(async ({ page }) => {
    // ไปที่หน้า นำเข้าข้อมูล
    await page.goto(process.env.TARGET_URL + '/import-data');
    await page.waitForLoadState('networkidle');
  });

  test('TC-STS-08-03-02: ตรวจสอบว่าเมื่อกรองข้อมูลแล้วไม่มีรายการตรงกัน ระบบแสดงข้อความแจ้งว่าไม่พบข้อมูล', async ({ page }) => {
    // 1. เข้าสู่หน้า "นำเข้าข้อมูล" แล้วคลิกแท็บ "ประวัติ"
    await page.getByRole('tab', { name: 'ประวัติ' }).click();

    // เลือกวันสุดท้ายที่มี ในเดือนถัดไป
    await page.locator('#audit-date-from').click();
    await page.getByRole('button', { name: 'ถัดไป' }).click();
    const dayBtn = page.getByRole('button', { name: /20\d{2}-\d{2}-\d{2}/ }).or(page.locator('td button'));
    if (await dayBtn.last().isVisible()) {
      await dayBtn.last().click();
    } else {
      await page.keyboard.press('Escape');
    }

    // 3. ตรวจสอบตารางว่าแสดงอะไร
    // Expected: ตารางแสดงข้อความว่า "ไม่พบประวัติที่ค้นหา 
    const noDataMessage = page.getByText('ไม่พบประวัติที่ค้นหา', { exact: false });
    await expect(noDataMessage.first()).toBeVisible({ timeout: 10000 });
  });

});
