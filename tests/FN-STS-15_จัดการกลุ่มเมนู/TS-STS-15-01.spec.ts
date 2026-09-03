import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการกรอกข้อมูล : TS-STS-15-01', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL + '/manage-role-groups');
  });

  test('TC-STS-15-01-01', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "+ เพิ่มกลุ่มเมนู"
    await page.getByText('เพิ่มกลุ่มเมนู').click();

    // 4. กรอกช่อง "ชื่อกลุ่มเมนู" ด้วยชื่อที่ถูกต้อง "กลุ่มทดสอบ 01"
    const nameInput = page.getByPlaceholder('กรอกชื่อกลุ่มเมนู');
    await nameInput.fill('กลุ่มทดสอบ 01');

    // 5. เลือก Checkbox เมนู "หน้าหลัก" อย่างน้อย 1 รายการ
    await page.getByRole('checkbox', { name: 'หน้าหลัก' }).check();

    // 6. คลิกปุ่ม "บันทึกข้อมูล"
    await page.getByRole('button', { name: 'บันทึกข้อมูล' }).click();

    // Expected: บันทึกข้อมูลสำเร็จ Modal ปิด และรายการ "กลุ่มทดสอบ 01" แสดงอยู่ในตาราง
    await expect(page.getByRole('cell', { name: 'กลุ่มทดสอบ 01', exact: true })).toBeVisible();
  });

  test('TC-STS-15-01-02', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "+ เพิ่มกลุ่มเมนู"
    await page.getByText('เพิ่มกลุ่มเมนู').click();

    // ไม่กรอกช่อง "ชื่อกลุ่มเมนู"
    // เลือก Checkbox เมนู "หน้าหลัก"
    await page.getByRole('checkbox', { name: 'หน้าหลัก' }).check();

    await page.getByRole('button', { name: 'บันทึกข้อมูล' }).click();

    // Expected: ระบบแสดงข้อความแจ้งเตือนใต้ช่อง "ชื่อกลุ่มเมนู"
    await expect(page.getByText('กรุณากรอกชื่อกลุ่มเมนู')).toBeVisible();
  });

  test('TC-STS-15-01-03', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "+ เพิ่มกลุ่มเมนู"
    await page.getByText('เพิ่มกลุ่มเมนู').click();

    // กรอกช่อง "ชื่อกลุ่มเมนู"
    const nameInput = page.getByPlaceholder('กรอกชื่อกลุ่มเมนู');
    await nameInput.fill('กลุ่มทดสอบ 02');

    // Expected: ระบบแสดงข้อความแจ้งเตือนให้เลือกเมนูอย่างน้อย 1 รายการ
    await expect(page.getByText('กรุณาเลือกเมนูอย่างน้อย 1 รายการ')).toBeVisible();
  });

  test('TC-STS-15-01-04', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "+ เพิ่มกลุ่มเมนู"
    await page.getByText('เพิ่มกลุ่มเมนู').click();

    //กดปุ่ม บันทึกข้อมูลไม่ได้เพราะไม่ได้กรอกข้อมูล
    await expect(page.getByRole('button', { name: 'บันทึกข้อมูล' })).toBeDisabled();
  });

});
