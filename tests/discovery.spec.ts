import { test, expect } from '@playwright/test';
import { faqTopics } from '../lib/faq';
test('fictional journey requires two agreements and can restart',async({page})=>{
 await page.goto('/fr/feature/');
 const demo=page.locator('#demo');
 await demo.getByRole('button',{name:'Les photos',exact:true}).click();
 await demo.getByLabel('Je souhaite montrer mes photos').check();
 await expect(demo.getByRole('img')).toHaveCount(0);
 await demo.getByLabel('Camille donne aussi son accord').check();
 await expect(demo.getByRole('img')).toBeVisible();
 await demo.getByLabel('Je souhaite montrer mes photos').uncheck();
 await expect(demo.getByRole('img')).toHaveCount(0);
 await demo.getByRole('button',{name:'Recommencer'}).click();
 await expect(demo.getByText('Camille, 29 ans',{exact:true})).toBeVisible();
 await page.setViewportSize({width:375,height:812});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('FAQ combines search and topic and guides each billing channel',async({page})=>{
 await page.goto('/fr/faq/');
 await page.getByRole('searchbox').fill('revel');
 await expect(page.locator('.faq-explorer details')).toHaveCount(1);
 await page.getByLabel('Sujet',{exact:true}).selectOption('billing');
 await expect(page.locator('.faq-explorer details')).toHaveCount(0);
 await page.getByRole('button',{name:'Effacer les filtres'}).click();
 await expect(page.locator('.faq-explorer details')).toHaveCount(faqTopics.length);
 await page.getByRole('searchbox').fill('Elo');
 await expect(page.locator('.faq-explorer details')).toHaveCount(1);
 const ranking=page.locator('.faq-explorer details');
 await ranking.locator('summary').click();
 await expect(ranking.locator('.faq-answer')).toContainText('affichés par proximité');
 await page.getByRole('button',{name:'Effacer les filtres'}).click();
 const help=page.locator('#subscription-help');
 await help.getByRole('button',{name:'Sur Android',exact:true}).click();
 await expect(help.locator('#provider-help').getByRole('link')).toHaveAttribute('href','https://play.google.com/store/account/subscriptions');
 await help.getByRole('button',{name:'Sur iPhone',exact:true}).click();
 await expect(help.locator('#provider-help').getByRole('link')).toHaveAttribute('href','https://apps.apple.com/account/subscriptions');
});

test("the Security page combines project and privacy information and appears in the main menu", async ({ page }) => {
  await page.goto("/fr/security/");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1 })).toHaveText("Sécurité");
  await expect(main.locator(".editorial-statement")).toBeVisible();
  await expect(main.locator("#privacy")).toBeVisible();
  await expect(main.locator("#source-code")).toBeVisible();
  const navigation = page.locator("#site-navigation");
  await expect(navigation.getByRole("link", { name: "Sécurité", exact: true })).toHaveAttribute("href", "/fr/security/");
  await expect(navigation.locator('a[href="/fr/about/"]')).toHaveCount(0);
});
