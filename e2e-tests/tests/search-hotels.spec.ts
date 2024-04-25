import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

// Sign in before managing hotels
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("liam.abirou@gmail.com");

  await page.locator("[name=password]").fill("qwer1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in successful!")).toBeVisible();
});

test("Should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("1 Hotel(s) found in Dublin")).toBeVisible();

  await expect(page.getByText("Dublin Skylon Hotel").first()).toBeVisible();
});

test("Should show hotel detail", async ({ page }) => {
  await page.goto(`${UI_URL}`);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Skylon Hotel").first().click();

  await expect(page).toHaveURL(/detail/);

  await expect(page.getByText("Dublin Skylon Hotel").first()).toBeVisible();

  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});
