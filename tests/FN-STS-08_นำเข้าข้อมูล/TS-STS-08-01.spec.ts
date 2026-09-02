import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการกรอกข้อมูล : TS-STS-08-01', () => {

  test('TC-STS-08-01-04: ตรวจสอบว่าเมื่อเลือกวันที่จาก Date Picker "จากวันที่" ระบบกรองประวัติการนำเข้าตามช่วงวันที่ได้ถูกต้อง', async ({ page }) => {
    // ไปที่หน้า นำเข้าข้อมูล (แก้ไขจาก process.env.TARGET_URL เป็น URL ที่กำหนด)
    await page.goto('https://sts-frontend-gold.vercel.app/import-data');
    // รอจนกว่าหน้าเว็บโหลดเสร็จ
    await page.waitForLoadState('networkidle');

    // 1. เข้าสู่หน้า "นำเข้าข้อมูล" แล้วคลิกแท็บ "ประวัติ"
    await page.getByRole('tab', { name: 'ประวัติ' }).click();

    // 3. เลือกวันที่จาก Calendar เช่น วันที่ 29-30 สิงหาคม 2569
    await page.locator('#audit-date-from').click();
    await page.getByRole('button', { name: 'ก่อนหน้า' }).click();
    await page.getByRole('button', { name: '2026-08-29', exact: true }).click();

    await page.locator('#audit-date-to').click();
    await page.getByRole('button', { name: 'ก่อนหน้า' }).click();
    await page.getByRole('button', { name: '2026-08-30', exact: true }).click();

    // 4. Expected: ตารางแสดงเฉพาะรายการประวัติการนำเข้าตั้งแต่วันที่ที่เลือกเป็นต้นไป ไม่มีวันที่ 31 ใน tbody
    const tbody = page.locator('tbody');
    await expect(tbody.getByText('29 สิงหาคม 2569').first()).toBeVisible();
    await expect(tbody.getByText('31 สิงหาคม 2569')).not.toBeVisible();
  });

});
