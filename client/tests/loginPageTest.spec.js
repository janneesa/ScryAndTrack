import { test, expect } from "@playwright/test";

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });

  test("should render the login page with necessary elements", async ({
    page,
  }) => {
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.locator("label:text('Email address:')")).toBeVisible();
    await expect(page.locator("label:text('Password:')")).toBeVisible();
    await expect(page.locator("button:text('Login')")).toBeVisible();
  });

  test("should show error for empty email and password", async ({ page }) => {
    await page.click("button:text('Login')");
    await expect(
      page.locator("text=Email and password are required")
    ).toBeVisible();
  });
});
