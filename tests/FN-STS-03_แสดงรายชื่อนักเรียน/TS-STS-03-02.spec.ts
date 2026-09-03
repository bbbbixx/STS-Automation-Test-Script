import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการทำงานของปุ่ม : TS-STS-03-02', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.TARGET_URL}/login`);
    await page.locator('#username').fill(process.env.ADMIN_USERNAME as string);
    await page.locator('#password').fill(process.env.ADMIN_PASSWORD as string);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/, { timeout: 20000 });
    await page.goto(`${process.env.TARGET_URL}/students`);
    await page.waitForLoadState('networkidle');
  });

  // TC-STS-03-02-01: ตรวจสอบว่าการคลิกปุ่มขอบเขตด้านบนตารางสามารถเปิด Modal "เลือกขอบเขต" ขึ้นมาได้สมบูรณ์
  test('TC-STS-03-02-01', async ({ page }) => {
    // 1. เข้าสู่หน้า "รายชื่อนักเรียน" (URL: https://sts-frontend-gold.vercel.app/students)
    // 2. คลิกปุ่ม "ขอบเขต ทุกจังหวัด" (หรือปุ่มแสดงขอบเขตปัจจุบัน)
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await expect(scopeBtn).toBeVisible();
    await scopeBtn.click();

    // ระบบเปิดหน้าต่าง Modal "เลือกขอบเขต" ขึ้นมากลางหน้าจอ
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'เลือกขอบเขต' })).toBeVisible();

    // พร้อมแสดง Dropdown เลือกโรงเรียน, Dropdown ชั้น, Dropdown ห้อง, ปุ่ม "ล้างตัวกรอง", ปุ่ม "เสร็จสิ้น" และปุ่มปิด "✕"
    await expect(modal.getByPlaceholder('เลือกโรงเรียน')).toBeVisible();
    await expect(modal.getByRole('button', { name: 'กรองตามระดับชั้น' })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'กรองตามห้อง' })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'ล้างตัวกรอง' })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'เสร็จสิ้น' })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Close dialog' })).toBeVisible();
  });

  // TC-STS-03-02-02: ตรวจสอบการเลือกโรงเรียนเป้าหมายใน Modal แล้วกดยืนยันด้วยปุ่ม "เสร็จสิ้น"
  test('TC-STS-03-02-02', async ({ page }) => {
    // 1. เปิด Modal "เลือกขอบเขต"
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // 2. คลิก Dropdown "เลือกโรงเรียน"
    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();

    // 3. เลือก "โรงเรียนดรุณศึกษาธิการ"
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();

    // 4. คลิกปุ่ม "เสร็จสิ้น"
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();

    // Modal ปิดลง ข้อความบนปุ่มขอบเขตเปลี่ยนเป็น "ขอบเขต โรงเรียนดรุณศึกษาธิการ" และตารางโหลดรายชื่อนักเรียนของโรงเรียนดรุณศึกษาธิการมาแสดง
    await expect(modal).not.toBeVisible();
    await expect(page.getByRole('button', { name: /ขอบเขต.*โรงเรียนดรุณศึกษาธิการ/ })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  // TC-STS-03-02-03: ตรวจสอบการกรองข้อมูลด้วยระดับชั้นเรียน (ชั้น) ใน Modal ขอบเขต
  test('TC-STS-03-02-03', async ({ page }) => {
    // 1. คลิกปุ่มขอบเขตเพื่อเปิด Modal
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // 2. เลือกโรงเรียน "โรงเรียนดรุณศึกษาธิการ"
    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();

    // 3. คลิก Dropdown "ทุกชั้น" แล้วเลือกชั้น "อ.1"
    const gradeBtn = modal.getByRole('button', { name: 'กรองตามระดับชั้น' });
    await gradeBtn.click();
    await page.locator('[role="listbox"]').getByRole('option', { name: 'อ.1' }).or(page.locator('[role="listbox"] >> text="อ.1"')).click();

    // 4. คลิกปุ่ม "เสร็จสิ้น"
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // ตารางแสดงผลเฉพาะรายชื่อนักเรียนที่กำลังศึกษาอยู่ในระดับชั้น "อ.1" ของโรงเรียนดรุณศึกษาธิการเท่านั้น คอลัมน์ชั้นแสดงค่าเป็น "อ.1" ทุกแถว
    await expect(page.locator('table')).toBeVisible();
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const gradeCell = rows.nth(i).locator('td').nth(3);
      await expect(gradeCell).toHaveText('อ.1');
    }
  });

  // TC-STS-03-02-04: ตรวจสอบการกรองข้อมูลด้วยห้องเรียน (ห้อง) ใน Modal ขอบเขต
  test('TC-STS-03-02-04', async ({ page }) => {
    // 1. คลิกปุ่มขอบเขตเพื่อเปิด Modal
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // 2. เลือกโรงเรียน "โรงเรียนดรุณศึกษาธิการ"
    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();

    // 3. เลือกชั้น "อ.1"
    const gradeBtn = modal.getByRole('button', { name: 'กรองตามระดับชั้น' });
    await gradeBtn.click();
    await page.locator('[role="listbox"]').getByRole('option', { name: 'อ.1' }).or(page.locator('[role="listbox"] >> text="อ.1"')).click();

    // 4. คลิก Dropdown "ทุกห้อง" แล้วเลือก "ห้อง 1"
    const roomBtn = modal.getByRole('button', { name: 'กรองตามห้อง' });
    await roomBtn.click();
    await page.locator('[role="listbox"]').getByRole('option', { name: 'ห้อง 1' }).or(page.locator('[role="listbox"] >> text="ห้อง 1"')).click();

    // 5. คลิกปุ่ม "เสร็จสิ้น"
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // ตารางแสดงผลเฉพาะนักเรียนชั้น "อ.1" ที่อยู่ "ห้อง 1" เท่านั้น ทุกแถวในตารางแสดงคอลัมน์ชั้นเป็น "อ.1" และห้องเป็น "ห้อง 1"
    await expect(page.locator('table')).toBeVisible();
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const gradeCell = rows.nth(i).locator('td').nth(3);
      const roomCell = rows.nth(i).locator('td').nth(4);
      await expect(gradeCell).toHaveText('อ.1');
      await expect(roomCell).toHaveText('ห้อง 1');
    }
  });

});
