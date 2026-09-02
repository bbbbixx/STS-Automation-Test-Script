import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการทำงานของปุ่ม : TS-STS-01-02', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL as string);
  });



  test('TC-STS-01-02-01', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    // 2-3. กรอกข้อมูลที่กล่อง Text Username ด้วย "newnew"
    await page.locator('#username').fill('newnew');

    // 4-5. กรอกข้อมูลที่กล่อง Text Password ด้วย "11111111"
    await page.locator('#password').fill('11111111');

    // 6. คลิกปุ่ม "เข้าสู่ระบบ"
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // ตรวจสอบว่าระบบต้องเข้าสู่หน้าจอหลักระบบติดตามผู้เรียน
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  test('TC-STS-01-02-02', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    // 2-3. กรอกข้อมูลที่กล่อง Text Username ด้วย "newneww"
    await page.locator('#username').fill('newneww');

    // 4-5. กรอกข้อมูลที่กล่อง Text Password ด้วย "111111112"
    await page.locator('#password').fill('111111112');

    // 6. คลิกปุ่ม "เข้าสู่ระบบ"
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // ตรวจสอบว่าระบบต้องแจ้ง error message คือ "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"
    await expect(page.getByText('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')).toBeVisible();
  });

  test('TC-STS-01-02-03', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    // 2-3. ไม่กรอกข้อมูลที่กล่อง Text Username (เว้นว่างเปล่า)
    await page.locator('#username').fill('');

    // 4-5. ไม่กรอกข้อมูลที่กล่อง Text Password (เว้นว่างเปล่า)
    await page.locator('#password').fill('');

    // 6. คลิกปุ่ม "เข้าสู่ระบบ"
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

    // ตรวจสอบว่าระบบต้องแจ้ง error message คือ "กรุณากรอกชื่อผู้ใช้งาน" และ "กรุณากรอกรหัสผ่าน"
    await expect(page.getByText('กรุณากรอกชื่อผู้ใช้งาน')).toBeVisible();
    await expect(page.getByText('กรุณากรอกรหัสผ่าน')).toBeVisible();
  });

});
