import { test, expect } from '@playwright/test';
import { ikeaHomePage } from '../pages/ikeaHome';
import { ikeaCatalogPage } from '../pages/ikeaCatalog';

test('search FLISAT series and filter by first color', async ({ page }) => {
  const homePage = new ikeaHomePage(page);
  const catalogPage = new ikeaCatalogPage(page);

  await homePage.goto();
  await homePage.acceptCookies();

  await homePage.clickSearchInput();
  await homePage.fillSearchInput('FLISAT');
  await homePage.clickSearchButton();

  await expect(catalogPage.itemsList).toBeVisible();
  await expect(catalogPage.itemsCountTable.first()).toBeVisible();

  await catalogPage.clickColorFilter();
  await catalogPage.scrollIntoColor();
  await expect(catalogPage.colorPickerFirst).toBeVisible();

  const colorFilterCountText = (await catalogPage.colorPickerFirstCount.textContent())?.trim() ?? '';
  const colorFilterCount = Number(colorFilterCountText.replace(/\D/g, ''));

  expect(colorFilterCount).toBeGreaterThan(0);

  await catalogPage.clickColorPicker();

  const readHeaderCount = async () => {
    const text = await catalogPage.itemsCountText.textContent();
    return Number(text?.replace(/\D/g, ''));
  };

  await expect.poll(readHeaderCount).toBe(colorFilterCount);
  await expect.poll(() => catalogPage.itemsCountTable.count()).toBe(colorFilterCount);
});