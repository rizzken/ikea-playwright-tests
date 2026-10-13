import { test, expect } from '@playwright/test';
import { ikeaHomePage } from '../pages/ikeaHome';
import { ikeaCatalogPage } from '../pages/ikeaCatalog';

test('search FLISAT series and filter by first color', async ({ page }) => {
  const homePage = new ikeaHomePage(page);
  const catalogPage = new ikeaCatalogPage(page);

  // Open the IKEA homepage
  await homePage.goto();
  await homePage.acceptCookies();

  // Click search and enter product series
  await homePage.clickSearchInput();
  await homePage.fillSearchInput('FLISAT');
  await homePage.clickSearchButton();

  // Verify catalog is loaded
  await expect(catalogPage.itemsList).toBeVisible();
  await expect(catalogPage.itemsCountTable.first()).toBeVisible();

  // Open color filter and choose the first color
  await catalogPage.clickColorFilter();
  await catalogPage.scrollIntoColor();
  await expect(catalogPage.colorPickerFirst).toBeVisible();

  const firstColorName = (await catalogPage.colorPickerFirst.textContent())?.trim();
  await catalogPage.clickColorPicker();

  // Verify the filtered page still has results
  await expect(catalogPage.itemsCountTable.first()).toBeVisible();

  // Assert every product card still contains the entered series name
  const productTexts = await catalogPage.itemsCountTable.allTextContents();
  expect(productTexts.length).toBeGreaterThan(0);

  for (const text of productTexts) {
    const normalized = text.toUpperCase();
    expect(normalized).toContain('FLISAT');

    if (firstColorName) {
      expect(normalized).toContain(firstColorName.toUpperCase());
    }
  }
});