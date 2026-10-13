import { test, expect } from '@playwright/test';
import { ikeaHomePage } from '../pages/ikeaHome';
import { ikeaCatalogPage } from '../pages/ikeaCatalog';

function parseCount(text: string | null): number {
  const digits = text?.replace(/\D/g, '');
  return digits ? Number(digits) : Number.NaN;
}

test('FLISAT results match the first color filter count', async ({ page }) => {
  const home = new ikeaHomePage(page);
  const catalog = new ikeaCatalogPage(page);

  await home.goto();

  if (await home.acceptCookie.isVisible()) {
    await home.acceptCookies();
  }

  await home.clickSearchInput();
  await home.fillSearchInput('FLISAT');
  await home.clickSearchButton();

  await expect(catalog.itemsList).toBeVisible();
  await expect(catalog.headerCount).toBeVisible();

  await catalog.clickColorFilter();
  await expect(catalog.colorPickerFirst).toBeVisible();

  // Save the first color's count before selecting it closes the filter menu.
  const colorCountText =
    (await catalog.colorPickerFirstCount.innerText()) ||
    (await catalog.colorPickerFirstCount.getAttribute('aria-label'));
  const colorCount = parseCount(colorCountText);

  expect(colorCount, `Could not read the first color count: "${colorCountText}"`)
    .toBeGreaterThan(0);

  await catalog.clickColorPicker();
  await expect(catalog.filterBar).toBeVisible();

  // Poll while the catalog updates asynchronously.
  await expect.poll(async () => {
    const headerCount = parseCount(await catalog.headerCount.innerText());
    const displayedCardCount = await catalog.itemsCountTable.count();

    return { headerCount, displayedCardCount };
  }).toEqual({
    headerCount: colorCount,
    displayedCardCount: colorCount,
  });
});