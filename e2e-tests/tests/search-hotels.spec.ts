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

test("Should book hotel", async ({ page }) => {
  await page.goto(`${UI_URL}`);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];

  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Skylon Hotel").first().click();

  await page.getByRole("button", { name: "Book now" }).click();

  await expect(page.getByText("Total Cost: $540.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();

  await stripeFrame.locator("[placeholder='Card number']").isVisible();
  await stripeFrame
    .locator("[placeholder='Card number']")
    .fill("4242424242424242");

  await stripeFrame.locator("[placeholder='MM / YY']").isVisible();
  await stripeFrame.locator("[placeholder='MM / YY']").fill("44/44");

  await stripeFrame.locator("[placeholder='CVC']").isVisible();
  await stripeFrame.locator("[placeholder='CVC']").fill("444");

  await stripeFrame.locator("[placeholder='ZIP']").isVisible();
  await stripeFrame.locator("[placeholder='ZIP']").fill("44444");

  await page.getByRole("button", { name: "Confirm Booking" }).click();

  await expect(page.getByText("Room Booked successfully")).toBeVisible();

  await page.getByRole("link", { name: "My Bookings" }).click();

  await expect(page.getByText("Dublin Skylon Hotel")).toBeVisible();
});
