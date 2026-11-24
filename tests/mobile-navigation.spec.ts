import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });

test("the mobile menu works with the keyboard without JavaScript", async ({ page }) => {
  await page.goto("/fr/");
  const navigation = page.getByRole("navigation", { name: "Navigation principale" });
  const trigger = navigation.getByRole("button", { name: "Menu", exact: true });
  const home = navigation.getByRole("link", { name: "Accueil", exact: true });
  const security = navigation.getByRole("link", { name: "Sécurité", exact: true });

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(home).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Tab");
  await expect(home).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(home).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");
  await security.press("Enter");
  await expect(page).toHaveURL(/\/fr\/security\/$/);
});
