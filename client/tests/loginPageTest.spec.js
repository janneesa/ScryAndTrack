import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByRole("navigation").click();
  await page.getByRole("link", { name: "Scry&Track" }).click();
  await page.getByRole("link", { name: "Signup" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("heading", { name: "Login" }).click();
  await page.getByText("Email address:").click();
  await page.locator('input[type="email"]').click();
  await page.getByText("Password:").click();
  await page.locator('input[type="password"]').click();
  await page.getByRole("button", { name: "Login" }).click();
});
