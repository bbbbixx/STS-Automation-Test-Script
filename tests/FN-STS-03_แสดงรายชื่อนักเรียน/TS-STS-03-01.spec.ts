import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการกรอกข้อมูล : TS-STS-03-01', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.TARGET_URL}/login`);
    await page.locator('#username').fill(process.env.ADMIN_USERNAME as string);
    await page.locator('#password').fill(process.env.ADMIN_PASSWORD as string);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/, { timeout: 20000 });
    await page.goto(`${process.env.TARGET_URL}/students`);
    await page.waitForLoadState('networkidle');
  });

  // TC-STS-03-01-01: ตรวจสอบการค้นหารายชื่อนักเรียนด้วยชื่อ-นามสกุลภาษาไทยที่ถูกต้อง (Positive Case)
  test('TC-STS-03-01-01', async ({ page }) => {
    // 1. เข้าสู่ระบบ STS และเปิดไปที่เมนู "รายชื่อนักเรียน" (ดำเนินการใน beforeEach แล้ว)

    // 2. เลือกขอบเขตโรงเรียนเป็น "โรงเรียนดรุณศึกษาธิการ"
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 3. คลิกที่ช่องค้นหา "ค้นหาชื่อนักเรียน..."
    const searchInput = page.getByPlaceholder('ค้นหาชื่อนักเรียน...');
    await searchInput.click();

    // 4. กรอกชื่อนักเรียนภาษาไทย "อชิรญา ชูศักดิ์"
    await searchInput.fill('อชิรญา ชูศักดิ์');

    // 5. ตรวจสอบการแสดงผลข้อมูลในตาราง
    // ตารางแสดงผลเฉพาะรายการนักเรียนที่มีชื่อตรงกับคำค้นหา "อชิรญา ชูศักดิ์" และข้อความสรุปจำนวนรายการแสดงผลถูกต้องตรงตามจำนวนผลลัพธ์ที่พบ
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr').first()).toContainText('อชิรญา ชูศักดิ์');
    await expect(page.getByText(/แสดง .* จาก 1 คน|1 คน/)).toBeVisible();
  });

  // TC-STS-03-01-02: ตรวจสอบการค้นหารายชื่อนักเรียนด้วยชื่อภาษาอังกฤษ
  test('TC-STS-03-01-02', async ({ page }) => {
    // 1. เข้าสู่หน้า "รายชื่อนักเรียน" และเลือกขอบเขตโรงเรียน "โรงเรียนดรุณศึกษาธิการ"
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 2. คลิกที่ช่องค้นหา "ค้นหาชื่อนักเรียน..."
    const searchInput = page.getByPlaceholder('ค้นหาชื่อนักเรียน...');
    await searchInput.click();

    // 3. กรอกชื่อภาษาอังกฤษ "Somchai"
    await searchInput.fill('Somchai');

    // 4. ตรวจสอบรายการที่แสดงในตาราง
    await expect(page.locator('tbody tr').first()).toBeVisible();
    const rowsCountUpper = await page.locator('tbody tr').count();
    expect(rowsCountUpper).toBeGreaterThan(0);
    await expect(page.getByText('Somchai Deejai')).toBeVisible();
    await expect(page.getByText('Somchai Jaidee')).toBeVisible();

    // 5. แก้ไขคำค้นหาเป็นตัวพิมพ์เล็ก "somchai"
    await searchInput.fill('somchai');

    // 6. ตรวจสอบผลลัพธ์ในตารางอีกครั้ง
    // ระบบแสดงผลรายชื่อนักเรียนที่มีชื่อภาษาอังกฤษตรงตามคำค้นหา เช่น "Somchai Deejai" และ "Somchai Jaidee" ทั้งตัวพิมพ์ใหญ่และตัวพิมพ์เล็กโดยผลการค้นหาไม่แตกต่างกัน
    const rowsCountLower = await page.locator('tbody tr').count();
    expect(rowsCountLower).toBe(rowsCountUpper);
    await expect(page.getByText('Somchai Deejai')).toBeVisible();
    await expect(page.getByText('Somchai Jaidee')).toBeVisible();
  });

  // TC-STS-03-01-03: ตรวจสอบการค้นหารายชื่อนักเรียนด้วยคำค้นหาบางส่วน (Partial Match)
  test('TC-STS-03-01-03', async ({ page }) => {
    // 1. เข้าสู่หน้า "รายชื่อนักเรียน" และเลือกขอบเขตโรงเรียน "โรงเรียนดรุณศึกษาธิการ"
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 2. คลิกที่ช่องค้นหา "ค้นหาชื่อนักเรียน..."
    const searchInput = page.getByPlaceholder('ค้นหาชื่อนักเรียน...');
    await searchInput.click();

    // 3. กรอกข้อความบางส่วนของนามสกุล "ชูศักดิ์"
    await searchInput.fill('ชูศักดิ์');

    // 4. ตรวจสอบรายการผลลัพธ์ในตาราง
    // ระบบแสดงรายชื่อนักเรียนทุกคนที่มีนามสกุลขึ้นต้นหรือประกอบด้วยคำว่า "ชูศักดิ์" ทั้งหมดในโรงเรียนที่เลือก
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const nameCell = rows.nth(i).locator('td').nth(1);
      await expect(nameCell).toContainText('ชูศักดิ์');
    }
  });

  // TC-STS-03-01-04: ตรวจสอบการแสดงผลของตารางเมื่อกรอกคำค้นหาที่ไม่ตรงกับข้อมูลนักเรียนคนใดในระบบ
  test('TC-STS-03-01-04', async ({ page }) => {
    // 1. เข้าสู่หน้า "รายชื่อนักเรียน" และเลือกขอบเขตโรงเรียน "โรงเรียนดรุณศึกษาธิการ"
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 2. คลิกที่ช่องค้นหา "ค้นหาชื่อนักเรียน..."
    const searchInput = page.getByPlaceholder('ค้นหาชื่อนักเรียน...');
    await searchInput.click();

    // 3. กรอกข้อความที่ไม่มีอยู่ในระบบ เช่น "ไม่มีชื่อคนนี้ในระบบแน่นอน999"
    await searchInput.fill('ไม่มีชื่อคนนี้ในระบบแน่นอน999');

    // 4. ตรวจสอบการแสดงผลในตาราง
    // ตารางไม่แสดงแถวข้อมูลนักเรียนใดๆ และแสดงข้อความ Empty State แจ้งเตือนว่า "ไม่พบข้อมูลนักเรียน" พร้อมข้อความสรุปแสดงผล 0 คน
    await expect(page.getByText('ไม่พบข้อมูลนักเรียน')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(0);
    await expect(page.getByText(/0 คน|0 จาก 0/)).toBeVisible();
  });

  // TC-STS-03-01-05: ตรวจสอบการค้นหารายชื่อนักเรียนด้วยการเว้นวรรค (Whitespace)
  test('TC-STS-03-01-05', async ({ page }) => {
    // 1. เข้าสู่หน้า "รายชื่อนักเรียน" และเลือกขอบเขตโรงเรียน "โรงเรียนดรุณศึกษาธิการ"
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 2. คลิกที่ช่องค้นหา "ค้นหาชื่อนักเรียน..."
    const searchInput = page.getByPlaceholder('ค้นหาชื่อนักเรียน...');
    await searchInput.click();

    // 3. กรอกช่องว่างเดี่ยวหรือหลายช่องว่าง "   "
    await searchInput.fill('   ');
    // และแสดงรายการทั้งหมดตามปกติ
    await expect(page.locator('tbody tr').first()).toBeVisible();
    const allRowsCount = await page.locator('tbody tr').count();
    expect(allRowsCount).toBeGreaterThan(0);

    // 4. ลบออกแล้วกรอก "  Somchai  " (มีช่องว่างนำหน้าและตามหลัง)
    await searchInput.fill('');
    await searchInput.fill('  Somchai  ');

    // เมื่อกรอกคำค้นหาพร้อมช่องว่าง ระบบสามารถค้นหาชื่อ "Somchai" ได้ถูกต้อง
    await expect(page.locator('tbody tr').first()).toBeVisible();
    await expect(page.getByText('Somchai Deejai')).toBeVisible();
    await expect(page.getByText('Somchai Jaidee')).toBeVisible();
  });

});
