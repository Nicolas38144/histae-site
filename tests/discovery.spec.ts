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

for (const [locale, label] of Object.entries({ fr: "Sécurité", en: "Security", es: "Seguridad", it: "Sicurezza" })) {
  test(`${locale}: Security is the only project and privacy page`, async ({ page }) => {
    await page.goto(`/${locale}/security/`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/security/$`));
    await expect(page.locator("main h1")).toHaveText(label);
    await expect(page.locator("main .editorial-statement")).toBeVisible();
    await expect(page.locator("main #privacy")).toBeVisible();
    await expect(page.locator("main #source-code")).toHaveCount(1);
    await expect(page.locator(`header #site-navigation a[href="/${locale}/security/"]`)).toHaveCount(1);
    await expect(page.locator(`header #site-navigation a[href="/${locale}/about/"]`)).toHaveCount(0);
    const retired = await page.goto(`/${locale}/about/`);
    expect(retired?.status()).toBe(404);
  });
}
