import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการแสดงผล : TS-STS-15-03', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL + '/manage-role-groups');
  });

  test('TC-STS-15-03-01', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // 3. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.locator('text=ทุกจังหวัด').click();
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();
    await page.waitForTimeout(2000);

    // 4. ตรวจสอบตารางแสดงผล และคอลัมน์ "ชื่อกลุ่มเมนู", "เมนูที่เข้าถึงได้", ปุ่มแก้ไข, ปุ่มลบ
    await expect(page.getByText('กลุ่มเมนู', { exact: true })).toBeVisible();
    await expect(page.getByText('เมนู', { exact: true })).toBeVisible();
    
    // ลองเช็คว่ามีปุ่มแก้ไขและลบอยู่ในตารางอย่างน้อย 1 ตัว (ถ้ามีข้อมูล)
    const firstRow = page.getByRole('row').nth(1);
    if (await firstRow.isVisible()) {
      await expect(firstRow.locator('button').first()).toBeVisible(); // ปุ่มแก้ไข
      await expect(firstRow.locator('button').last()).toBeVisible();  // ปุ่มลบ
    }
  });

  test('TC-STS-15-03-02', async ({ page }) => {
    await page.waitForTimeout(2000);
    // เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.locator('text=ทุกจังหวัด').click();
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "+ เพิ่มกลุ่มเมนู"
    await page.getByText('เพิ่มกลุ่มเมนู').click();

    // 4. ตรวจสอบรายการ Checkbox เมนูทั้งหมดที่แสดงใน Modal
    // Expected: แสดงรายการ Checkbox ของทุกเมนูที่ระบบรองรับครบถ้วน
    await expect(page.getByRole('checkbox', { name: 'หน้าหลัก' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'จัดการกลุ่มเมนู' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'รายชื่อนักเรียน' })).toBeVisible();
  });

});
