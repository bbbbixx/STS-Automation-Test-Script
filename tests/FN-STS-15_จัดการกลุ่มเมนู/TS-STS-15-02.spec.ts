import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการทำงานของปุ่ม : TS-STS-15-02', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL + '/manage-role-groups');
  });

  test('TC-STS-15-02-01', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "+ เพิ่มกลุ่มเมนู"
    await page.getByText('เพิ่มกลุ่มเมนู').click();

    // Expected: Modal ฟอร์ม "เพิ่มกลุ่มเมนู" เปิดขึ้น แสดงช่อง "ชื่อกลุ่มเมนู"
    await expect(page.getByText('กำหนดชื่อและเมนูสำหรับ โรงเรียนดรุณศึกษาธิการ โดยกลุ่มนี้จะใช้ได้เฉพาะโรงเรียนนี้')).toBeVisible();
  });

  test('TC-STS-15-02-02', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "แก้ไข" ของรายการกลุ่มทดสอบ 01
    // ค้นหาแถวที่มีชื่อ กลุ่มทดสอบ 01 แล้วกดปุ่มแก้ไขในแถวนั้น
    const row = page.getByRole('row', { name: 'กลุ่มทดสอบ 01', exact: false });
    await row.locator('button').first().click();

    // 4. แก้ไขช่อง "ชื่อกลุ่มเมนู"
    const nameInput = page.getByPlaceholder('กรอกชื่อกลุ่มเมนู');
    await nameInput.fill('กลุ่มทดสอบ 011');

    await page.getByRole('checkbox', { name: 'จัดการผู้ใช้งาน' }).check();
    
    // 5. คลิกปุ่ม "บันทึกข้อมูล"
    await page.getByRole('button', { name: 'บันทึกข้อมูล' }).click();

    // Expected: บันทึกข้อมูลสำเร็จ Modal ปิด และตารางแสดงข้อมูลที่แก้ไขแล้ว
    await expect(page.getByRole('cell', { name: 'กลุ่มทดสอบ 011', exact: true })).toBeVisible();
  });

  test('TC-STS-15-02-03', async ({ page }) => {
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "ลบ" ของรายการกลุ่มทดสอบ 011
    const row = page.getByRole('row', { name: 'กลุ่มทดสอบ 011', exact: false });
    await row.locator('button').last().click(); // สมมติว่าปุ่มสุดท้ายคือลบ

    // 4. ตรวจสอบว่า Dialog ยืนยันการลบปรากฏขึ้น
    await expect(page.getByText('ลบ', { exact: false }).last()).toBeVisible();

    // 5. คลิกปุ่ม "ยืนยัน" บน Dialog
    await page.getByText('ลบ', { exact: true }).click();

    // Expected: Dialog ปิด รายการกลุ่มเมนูถูกลบออกจากตาราง
    await expect(page.getByRole('cell', { name: 'กลุ่มทดสอบ 011', exact: true })).not.toBeVisible();
  });

  test('TC-STS-15-02-04', async ({ page }) => {
    // Note: Test case นี้ใน testcase.md จะเป็น TC-STS-15-02-05 (ตรวจสอบปุ่ม "ยกเลิก" บน Dialog ยืนยันการลบ)
    await page.waitForTimeout(2000);
    // คลิกปุ่ม ทุกจังหวัด
    await page.locator('text=ทุกจังหวัด').click();
    // 2. เลือกโรงเรียนจาก Dropdown "เลือกโรงเรียน"
    await page.getByPlaceholder('เลือกโรงเรียน').click();
    await page.getByText('โรงเรียนดรุณศึกษาธิการ').click();
    await page.locator('text=เสร็จสิ้น').click();

    // 3. คลิกปุ่ม "ลบ" ของรายการใดก็ได้ (สมมติว่าเป็นแถวแรก)
    const rows = page.getByRole('row');
    await rows.nth(1).locator('button').last().click(); // ข้าม header

    // 4. คลิกปุ่ม "ยกเลิก" บน Dialog ยืนยัน
    await page.getByText('ยกเลิก').click();

    // Expected: Dialog ปิด รายการยังคงอยู่ในตารางตามเดิม
    // เราไม่ได้จับ text ว่าตารางแสดงอะไร แต่เช็คว่าปุ่มยืนยันหายไปและไม่มี error
    await expect(page.getByText('ยกเลิก')).not.toBeVisible();
  });

});
