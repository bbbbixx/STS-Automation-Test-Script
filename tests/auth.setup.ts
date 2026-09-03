import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const fs = require('fs');
  // หากมีไฟล์ auth แล้ว ให้ข้ามการ login เพื่อลดเวลา
  if (fs.existsSync(authFile)) {
    console.log('Skipping authentication as auth file already exists.');
    return;
  }

  // ไปที่หน้า Login
  await page.goto(process.env.TARGET_URL as string);

  // กรอก Username และ Password
  await page.locator('#username').fill(process.env.ADMIN_USERNAME as string);
  await page.locator('#password').fill(process.env.ADMIN_PASSWORD as string);

  // กดปุ่มเข้าสู่ระบบ
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();

  // รอจนกว่าเว็บโหลดเสร็จแล้ว header จะเห็น ระบบติดตามผู้เรียน
  await page.waitForURL(process.env.TARGET_URL as string);

  // หน้านั้นมีคำว่า แผนที่นักเรียนเสี่ยงรายจังหวัด
  await page.getByText('แผนที่นักเรียนเสี่ยงรายจังหวัด').waitFor();

  // บันทึก State ของ Browser (Cookies, LocalStorage ฯลฯ)
  await page.context().storageState({ path: authFile });
});
