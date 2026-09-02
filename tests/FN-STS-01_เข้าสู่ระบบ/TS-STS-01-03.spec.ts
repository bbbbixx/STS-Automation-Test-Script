import { test, expect } from '@playwright/test';

test.describe('Test Scenario ตรวจสอบการแสดงผล : TS-STS-01-03', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.TARGET_URL as string);
  });

  // TC-STS-01-03-01: ตรวจสอบการแสดงผล Label Clarity โดยช่อง Username และ Password ต้องมี placeholder ที่ชัดเจน
  test('TC-STS-01-03-01', async ({ page }) => {
    const usernameInput = page.locator('#username');
    const passwordInput = page.locator('#password');

    // ตรวจสอบ placeholder ของ Username และ Password
    await expect(usernameInput).toHaveAttribute('placeholder', 'กรอกชื่อผู้ใช้งาน');
    await expect(passwordInput).toHaveAttribute('placeholder', 'กรอกรหัสผ่าน');
  });

  // TC-STS-01-03-02: ตรวจสอบการแสดงผลข้อความ โดยภาษาในปุ่มและข้อความระบบควรเป็นภาษาไทยให้ตรงกัน
  test('TC-STS-01-03-02', async ({ page }) => {
    // ตรวจสอบภาษาไทยในปุ่ม "เข้าสู่ระบบ"
    const loginButton = page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true });
    await expect(loginButton).toBeVisible();

    // ตรวจสอบข้อความระบบ "ระบบติดตามผู้เรียน"
    const systemTitle = page.getByText('ระบบติดตามผู้เรียน');
    await expect(systemTitle).toBeVisible();
  });

  // TC-STS-01-03-03: ตรวจสอบการแสดงผล Sidebar Menu และวิดเจ็ตแดชบอร์ดหลังเข้าสู่ระบบด้วยบทบาท "ผู้บริหาร" (Executive)
  test('TC-STS-01-03-03', async ({ page }) => {
    await page.locator('#username').fill('bossboss');
    await page.locator('#password').fill('11111111');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/);

    // ตรวจสอบแถบเมนูด้านซ้าย (Sidebar) ของผู้บริหาร
    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('link', { name: 'หน้าหลัก' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'ถามข้อมูลด้วยภาษาไทย' })).toBeVisible();

    //  ตรวจสอบแถบ card
    await expect(page.getByText('นักเรียนทั้งหมด', { exact: true })).toBeVisible();
    await expect(page.getByText('นักเรียนกลุ่มเสี่ยง', { exact: true })).toBeVisible();
    await expect(page.getByText('เคสทั้งหมด', { exact: true })).toBeVisible();
    await expect(page.getByText('เคสที่เสร็จสิ้น', { exact: true })).toBeVisible();
    await expect(page.getByText('เคสที่กำลังดำเนินการ', { exact: true }).first()).toBeVisible();

    // ตรวจสอบวิดเจ็ตและข้อมูลที่แสดงบนหน้าแดชบอร์ด (main container)
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByText('แผนที่นักเรียนเสี่ยงรายจังหวัด', { exact: true })).toBeVisible();
    await expect(page.getByText('พื้นที่ที่มีนักเรียนเสี่ยงสูง Top 5 จังหวัด', { exact: true })).toBeVisible();
    await expect(page.getByText('แนวโน้มการมาเรียนรายวัน', { exact: true })).toBeVisible();
    await expect(page.getByText('ภาพรวมความเสี่ยงจากผลการติดตาม', { exact: true })).toBeVisible();
  });

  // TC-STS-01-03-04: ตรวจสอบการแสดงผลชื่อผู้ใช้ สังกัด ตำแหน่ง และเมนูโปรไฟล์ของผู้บริหาร
  test('TC-STS-01-03-04', async ({ page }) => {
    await page.locator('#username').fill('bossboss');
    await page.locator('#password').fill('11111111');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/);

    // ตรวจสอบและคลิกไอคอนโปรไฟล์ผู้ใช้ที่มุมขวาบนของ Header
    const profileBtn = page.locator('header button').last();
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    // ตรวจสอบข้อความและรายการเมนูที่ปรากฏใน Dropdown
    await expect(page.getByText('ธนกร นนลือชา')).toBeVisible();
    await expect(page.getByText('สังกัด: Kob Family')).toBeVisible();
    await expect(page.getByText('ตำแหน่ง: ผู้บริหาร')).toBeVisible();
    await expect(page.getByText('แก้ไขข้อมูลส่วนตัว')).toBeVisible();
    await expect(page.getByText('ออกจากระบบ')).toBeVisible();
  });

  // TC-STS-01-03-05: ตรวจสอบการแสดงผล Sidebar Menu และวิดเจ็ตแดชบอร์ดหลังเข้าสู่ระบบด้วยบทบาท "ผู้อำนวยการ" (Director)
  test('TC-STS-01-03-05', async ({ page }) => {
    await page.locator('#username').fill('newinwza');
    await page.locator('#password').fill('11111111');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/);

    // ตรวจสอบแถบเมนูด้านซ้าย (Sidebar) ของผู้อำนวยการ
    const sidebar = page.locator('aside');
    await expect(sidebar.getByRole('link', { name: 'หน้าหลัก' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'รายงานสถานะนักเรียน' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'รายชื่อนักเรียน' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'รายชื่อครู' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'ห้องเรียนทั้งหมด' })).toBeVisible();

    // ตรวจสอบวิดเจ็ตและข้อมูลที่แสดงบนหน้าแดชบอร์ด
    await expect(page.locator('main')).toBeVisible();
  });

  // TC-STS-01-03-06: ตรวจสอบการแสดงผลชื่อผู้ใช้ สังกัด ตำแหน่ง และเมนูโปรไฟล์ของผู้อำนวยการ
  test('TC-STS-01-03-06', async ({ page }) => {
    await page.locator('#username').fill('newinwza');
    await page.locator('#password').fill('11111111');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/);

    // ตรวจสอบและคลิกไอคอนโปรไฟล์ผู้ใช้
    const profileBtn = page.locator('header button').last();
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    // ตรวจสอบข้อความและรายการเมนูใน Dropdown
    await expect(page.getByText('ประยัทธ์ จันทร์พุธศุกร์')).toBeVisible();
    await expect(page.getByText('สังกัด: Kob Family')).toBeVisible();
    await expect(page.getByText('ตำแหน่ง: ผู้อำนวยการ')).toBeVisible();
    await expect(page.getByText('แก้ไขข้อมูลส่วนตัว')).toBeVisible();
    await expect(page.getByText('ออกจากระบบ')).toBeVisible();
  });

  // TC-STS-01-03-07: ตรวจสอบการแสดงผล Sidebar Menu และวิดเจ็ตแดชบอร์ดหลังเข้าสู่ระบบด้วยบทบาท "ผู้ดูแลระบบ" (Admin)
  test('TC-STS-01-03-07', async ({ page }) => {
    await page.locator('#username').fill('newwen');
    await page.locator('#password').fill('11111111');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/);

    // ขยายแถบเมนูด้านข้างก่อน (หากเมนูอยู่ในสถานะย่อ ข้อความจะมี opacity-0 ทำให้ Playwright มองเป็น hidden)
    const expandSidebarBtn = page.getByRole('button', { name: 'ขยายเมนูด้านข้าง' });
    if (await expandSidebarBtn.isVisible()) {
      await expandSidebarBtn.click();
    }

    // ตรวจสอบแถบเมนูด้านซ้าย (Sidebar) ครบทุกหัวข้อตามรูปภาพ
    const sidebar = page.locator('aside');

    await expect(sidebar.getByRole('link', { name: 'หน้าหลัก' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'รายงานสถานะนักเรียน' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'รายชื่อนักเรียน' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'รายชื่อครู' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'ห้องเรียนทั้งหมด' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'ถามข้อมูลด้วยภาษาไทย' })).toBeVisible();
    await expect(sidebar.getByText('จัดการข้อมูล', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('ระบบเช็กชื่อ', { exact: true })).toBeVisible();
    await expect(sidebar.getByText('จัดการสิทธิ์ผู้ใช้งาน', { exact: true })).toBeVisible();

    // ตรวจสอบวิดเจ็ตและข้อมูลที่แสดงบนหน้าแดชบอร์ด
    await expect(page.locator('main')).toBeVisible();

    //  ตรวจสอบแถบ card
    await expect(page.getByText('นักเรียนทั้งหมด', { exact: true })).toBeVisible();
    await expect(page.getByText('นักเรียนกลุ่มเสี่ยง', { exact: true })).toBeVisible();
    await expect(page.getByText('เคสทั้งหมด', { exact: true })).toBeVisible();
    await expect(page.getByText('เคสที่เสร็จสิ้น', { exact: true })).toBeVisible();
    await expect(page.getByText('เคสที่กำลังดำเนินการ', { exact: true }).first()).toBeVisible();

    // ตรวจสอบวิดเจ็ตและข้อมูลที่แสดงบนหน้าแดชบอร์ด (main container)
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByText('แผนที่นักเรียนเสี่ยงรายจังหวัด', { exact: true })).toBeVisible();
    await expect(page.getByText('พื้นที่ที่มีนักเรียนเสี่ยงสูง Top 5 จังหวัด', { exact: true })).toBeVisible();
    await expect(page.getByText('แนวโน้มการมาเรียนรายวัน', { exact: true })).toBeVisible();
    await expect(page.getByText('ภาพรวมความเสี่ยงจากผลการติดตาม', { exact: true })).toBeVisible();
  });

  // TC-STS-01-03-08: ตรวจสอบการแสดงผลชื่อผู้ใช้ ตำแหน่ง และเมนูโปรไฟล์ของผู้ดูแลระบบ
  test('TC-STS-01-03-08', async ({ page }) => {
    await page.locator('#username').fill('newwen');
    await page.locator('#password').fill('11111111');
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    await expect(page).not.toHaveURL(/.*login.*/);

    // ตรวจสอบและคลิกไอคอนโปรไฟล์ผู้ใช้
    const profileBtn = page.locator('header button').last();
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    // ตรวจสอบข้อความและรายการเมนูใน Dropdown
    await expect(page.getByText('อรทุย ศรีสุวัณ')).toBeVisible();
    await expect(page.getByText('ตำแหน่ง: ผู้ดูแลระบบ')).toBeVisible();
    await expect(page.getByText('แก้ไขข้อมูลส่วนตัว')).toBeVisible();
    await expect(page.getByText('ออกจากระบบ')).toBeVisible();
  });

});
