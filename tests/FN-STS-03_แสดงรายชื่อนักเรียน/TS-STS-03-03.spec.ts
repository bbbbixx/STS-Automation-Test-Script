import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการแสดงผล : TS-STS-03-03', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.TARGET_URL}/login`);
    await page.locator('#username').fill(process.env.ADMIN_USERNAME as string);
    await page.locator('#password').fill(process.env.ADMIN_PASSWORD as string);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/, { timeout: 20000 });
    await page.goto(`${process.env.TARGET_URL}/students`);
    await page.waitForLoadState('networkidle');
  });

  // TC-STS-03-03-01: ตรวจสอบการคลิกลิงก์ชื่อนักเรียนเพื่อนำทางไปยังหน้าข้อมูลนักเรียน
  test('TC-STS-03-03-01', async ({ page }) => {
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

    // คลิกปุ่ม "เสร็จสิ้น"
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 5. ในตารางรายชื่อนักเรียน ค้นหาหรือเลือกนักเรียนชื่อ "Somchai Deejai"
    const studentButton = page.getByRole('button', { name: /Somchai Deejai/ }).or(page.getByText('Somchai Deejai')).first();
    await expect(studentButton).toBeVisible();

    // 6. นำเมาส์ไปชี้ที่ชื่อ "Somchai Deejai" (เคอร์เซอร์เปลี่ยนเป็นรูปมือ Pointer)
    await studentButton.hover();

    // 7. คลิกที่ชื่อ "Somchai Deejai"
    await studentButton.click();

    // ระบบนำทางไปยังหน้าข้อมูลส่วนตัวของนักเรียน (URL: https://sts-frontend-gold.vercel.app/students/{studentId}) แสดงหัวข้อ "ข้อมูลนักเรียน", ชื่อ "Somchai Deejai", ระดับชั้น, เกรดเฉลี่ย
    await expect(page).toHaveURL(/.*\/students\/.+/);
    await expect(page.getByText('ข้อมูลนักเรียน')).toBeVisible();
    await expect(page.getByText('Somchai Deejai')).toBeVisible();
    await expect(page.getByText(/ระดับชั้น|ชั้น/)).toBeVisible();
    await expect(page.getByText(/เกรดเฉลี่ย|GPA/i)).toBeVisible();
  });

  // TC-STS-03-03-02: ตรวจสอบการแสดงผลองค์ประกอบหลักเมื่อเข้าสู่หน้ารายชื่อนักเรียนครั้งแรก
  test('TC-STS-03-03-02', async ({ page }) => {
    // 1. นำทางไปยัง URL: https://sts-frontend-gold.vercel.app/students (ดำเนินการใน beforeEach แล้ว)
    // 2. ตรวจสอบองค์ประกอบบนหน้าจอ
    // ระบบไม่แสดงตาราง แต่แสดงพื้นที่สถานะว่าง (Empty State) พร้อมข้อความ "เลือกโรงเรียน" และคำบรรยาย "เลือกโรงเรียนจากตัวกรองด้านบนเพื่อแสดงรายชื่อนักเรียน"
    await expect(page.locator('table')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'เลือกโรงเรียน' })).toBeVisible();
    await expect(page.getByText('เลือกโรงเรียนจากตัวกรองด้านบนเพื่อแสดงรายชื่อนักเรียน')).toBeVisible();
  });

  // TC-STS-03-03-03: ตรวจสอบความถูกต้องและครบถ้วนของคอลัมน์ในตารางรายชื่อนักเรียน
  test('TC-STS-03-03-03', async ({ page }) => {
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

    // คลิกปุ่ม "เสร็จสิ้น"
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 5. ตรวจสอบแถวหัวตาราง (Table Header)
    // 6. อ่านชื่อคอลัมน์จากซ้ายไปขวา
    // แสดงครบทั้ง 6 คอลัมน์ตามลำดับ: 1. ลำดับ, 2. ชื่อ - นามสกุล, 3. โรงเรียน, 4. ชั้น, 5. ห้อง, 6. สถานะ โดยทุกคอลัมน์มีไอคอนแสดงทิศทางการจัดเรียง
    const headers = page.locator('table thead th, table [role="columnheader"]');
    await expect(headers).toHaveCount(6);

    const expectedHeaders = ['ลำดับ', 'ชื่อ - นามสกุล', 'โรงเรียน', 'ชั้น', 'ห้อง', 'สถานะ'];
    for (let i = 0; i < expectedHeaders.length; i++) {
      await expect(headers.nth(i)).toContainText(expectedHeaders[i]);
    }
  });

  // TC-STS-03-03-04: ตรวจสอบการแสดงผลข้อความเมื่อค้นหาไม่พบข้อมูลนักเรียน
  test('TC-STS-03-03-04', async ({ page }) => {
    // เลือกโรงเรียนเพื่อให้ตารางโหลดก่อนทำการค้นหา
    const scopeBtn = page.getByRole('button', { name: /ขอบเขต/ });
    await scopeBtn.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const schoolInput = modal.getByPlaceholder('เลือกโรงเรียน');
    await schoolInput.click();
    await page.getByRole('option', { name: 'โรงเรียนดรุณศึกษาธิการ' }).or(page.getByText('โรงเรียนดรุณศึกษาธิการ')).first().click();
    await modal.getByRole('button', { name: 'เสร็จสิ้น' }).click();
    await expect(modal).not.toBeVisible();

    // 1. พิมพ์คำค้นหาที่ไม่มีนักเรียนชื่อนี้ เช่น "xxxxxyz123" ในช่องค้นหา
    const searchInput = page.getByPlaceholder('ค้นหาชื่อนักเรียน...');
    await searchInput.fill('xxxxxyz123');

    // 2. สังเกตพื้นที่ตาราง
    // ตารางแสดงผลข้อความตรงกลางตารางอย่างชัดเจนว่า "ไม่พบข้อมูลนักเรียน" และไม่มีแถวข้อมูลอื่นหลงเหลือ
    await expect(page.getByText('ไม่พบข้อมูลนักเรียน')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(0);
  });

});
