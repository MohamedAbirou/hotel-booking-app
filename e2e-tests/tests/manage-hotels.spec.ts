import { test, expect } from "@playwright/test";
import path from "path";

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

// add a hotel
test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);

  await page.locator("[name=name]").fill("Test Hotel");
  await page.locator("[name=city]").fill("Test City");
  await page.locator("[name=country]").fill("Test Country");
  await page
    .locator("[name=description]")
    .fill("This is a description for the Test Hotel");
  await page.locator("[name=pricePerNight]").fill("100");

  await page.selectOption("select[name=starRating]", "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator("[name=adultCount]").fill("2");
  await page.locator("[name=childCount]").fill("4");

  await page.setInputFiles("[name=imageFiles]", [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel Created!")).toBeVisible();
});

// Fetch hotels and display them
test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByRole("heading", { name: "My Hotels" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Riad Al-Qurtubi" })
  ).toBeVisible();

  await expect(
    page.getByText("Just 1.2 miles from Tangier Municipal Beach and a 7-minute")
  ).toBeVisible();

  await expect(page.getByText("Tangier, Morocco")).toBeVisible();

  await expect(page.getByText("Beach Resort")).toBeVisible();

  await expect(page.getByText("$150 per night")).toBeVisible();

  await expect(page.getByText("2 adults, 3 children")).toBeVisible();

  await expect(page.getByText("3 Star Rating").first()).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

// Update a hotel
test("should allow user to update a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await expect(page.getByText("Edit Hotel")).toBeVisible();

  await page.waitForSelector("[name=name]", { state: "attached" });
  await expect(page.locator("[name=name]")).toHaveValue("Riad Al-Qurtubi");
  await page.locator("[name=name]").fill("Riad Al-Qurtubi UPDATED");

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel Updated!")).toBeVisible();

  await page.reload();

  await expect(page.locator("[name=name]")).toHaveValue(
    "Riad Al-Qurtubi UPDATED"
  );

  await page.locator("[name=name]").fill("Riad Al-Qurtubi");

  await page.getByRole("button", { name: "Save" }).click();
});
