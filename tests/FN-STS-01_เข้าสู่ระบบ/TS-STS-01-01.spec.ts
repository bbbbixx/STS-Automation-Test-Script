import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการกรอกข้อมูล : TS-STS-01-01', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL as string);
  });

  test('TC-STS-01-01-01', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    const usernameInput = page.locator('#username');

    // 2. กรอกข้อมูลที่กล่อง Text Username ด้วย "newnew"
    await usernameInput.fill('newnew');

    // 3. คลิกเมาส์ออกจาก Text Username (blur)
    await usernameInput.blur();

    // 4. ตรวจสอบว่าสามารถกรอกข้อมูลทั้งตัวอักษรได้
    await expect(usernameInput).toHaveValue('newnew');
  });

  test('TC-STS-01-01-02', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    const passwordInput = page.locator('#password');

    // 2. กรอกข้อมูลที่กล่อง Text Password ด้วย "11111111"
    await passwordInput.fill('11111111');

    // 3. คลิกเมาส์ออกจาก Text Password (blur)
    await passwordInput.blur();

    // 4. ตรวจสอบว่าแสดงผลเป็น ●●● (attribute type="password") และมีค่าถูกต้อง
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveValue('11111111');
  });

  test('TC-STS-01-01-03', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    const usernameInput = page.locator('#username');

    // 2. กรอกข้อมูลข้อความเกิน 50 ตัวอักษร (106 ตัวอักษร)
    const longUsername = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await usernameInput.fill(longUsername);

    // 3. คลิกเมาส์ออกจาก Text Username (blur)
    await usernameInput.blur();

    // 4. ตรวจสอบว่าไม่สามารถกรอกข้อความได้เกิน 50 ตัวอักษร
    const value = await usernameInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(50);
  });

  test('TC-STS-01-01-04', async ({ page }) => {
    // 1. เปิดหน้าจอเข้าสู่ระบบ (ดำเนินการผ่าน beforeEach แล้ว)
    const passwordInput = page.locator('#password');

    // 2. กรอกข้อมูลรหัสผ่านตามที่ระบุ (50 ตัวอักษร)
    const longPassword = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await passwordInput.fill(longPassword);

    // 3. คลิกเมาส์ออกจาก Text Password (blur)
    await passwordInput.blur();

    // 4. ตรวจสอบว่าไม่สามารถกรอกข้อความได้เกิน 50 ตัวอักษร
    const value = await passwordInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(50);
  });

});
