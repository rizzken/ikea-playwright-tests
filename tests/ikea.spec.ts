import { test, expect } from '@playwright/test';
import { ikeaHomePage } from '../pages/IkeaHome';
import { ikeaCatalogPage } from '../pages/ikeaCatalog';
import {ikeaItem} from '../pages/ikeaItemPage'

test.beforeEach(async({page}) => {
    const homePage = new ikeaHomePage(page);
    await homePage.goto();
    await expect(page).toHaveTitle(/IKEA/);
    await homePage.acceptCookies();
})

test('firefox sanity check', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('search and filter', async({page}) => {
    const homePage = new ikeaHomePage(page);
    await expect(homePage.ikeaLogo).toHaveAttribute('src', 'https://www.ikea.com/global/assets/logos/brand/ikea.svg');
    await expect(homePage.photoButton).toHaveAttribute('aria-hidden', 'false');
    await homePage.clickSearchInput();
    await expect(homePage.searchDialog).toBeVisible();
    await homePage.fillSearchInput();
    await expect(homePage.searchButton).toHaveAttribute('aria-hidden', 'false');
    await homePage.clickSearchButton();
    const ikeaCatalog = new ikeaCatalogPage(page);
    await expect(ikeaCatalog.itemsCountText).toHaveText('3');
    const cardCount = await ikeaCatalog.itemsCountTable.count();
    const headerCount = await ikeaCatalog.headerCount.textContent();
    expect(cardCount).toEqual(Number(headerCount));
    await expect(ikeaCatalog.itemsList).toBeVisible();
    await ikeaCatalog.clickColorFilter();
    await ikeaCatalog.scrollIntoPink();
    await expect(ikeaCatalog.colorPickerPink).toBeVisible();
    await ikeaCatalog.clickColorPicker();
    await expect(ikeaCatalog.itemsCountText).toHaveText('1');
    const cardCountF = await ikeaCatalog.itemsCountTable.count();
    expect(cardCountF).toBe(1);
    await expect(ikeaCatalog.filterBar).toBeVisible();
})

test('search items', async({page}) => {
    const homePage = new ikeaHomePage(page);
    await homePage.clickItems();
    await expect(homePage.catalogNavigation).toBeVisible();
    
    let className = await homePage.nextItemButton.getAttribute('class');

    while (!className?.includes('hnf-overflow-carousel__button--hidden')) {
        if (await homePage.tabKids.isVisible()) {
            await homePage.clickTabKids();
            break;
        } else {
            await homePage.clicknextItemButton();
        }
    }
    await expect(homePage.kidsDD).toBeVisible();
    await homePage.clickkidsLink();
    const ikeaCatalog = new ikeaCatalogPage(page);
    await ikeaCatalog.scrollToListItemMammut();
    await ikeaCatalog.clickMammut();
    const itemNameSearch = await ikeaCatalog.mammutTableText.textContent();
    await ikeaCatalog.clickMammutTable();
    const itemPage = new ikeaItem(page);
    const itemPageText = await itemPage.content.textContent();
    console.log('itemNameSearch:', itemNameSearch);
    console.log('itemPageText:', itemPageText);
    expect(itemNameSearch?.includes(itemPageText ?? '')).toBeTruthy();
})

test('search catalog', async({page}) => {
    const homePage = new ikeaHomePage(page);
    await homePage.hoverFirstItem();
    await expect(homePage.nextCategoryButton).toBeVisible();
    let className = await homePage.nextCategoryButton.getAttribute('class');

    while (!className?.includes('hnf-carousel__button--hidden')) {
        if (await homePage.kidsCategoryScroll.isVisible()) {
            await homePage.clickKidsCategory();
            break;
        } else {
            await homePage.clickNextCategoryButton();
            className = await homePage.nextCategoryButton.getAttribute('class');
        }        
    }
    const ikeaCatalog = new ikeaCatalogPage(page);
    await expect(ikeaCatalog.kidsCategory).toBeVisible();
    await ikeaCatalog.clickKidsButton();
    await ikeaCatalog.scrollFirstItem();
    await expect(ikeaCatalog.firstItemColor).toBeVisible();
    const altText = await ikeaCatalog.firstItemColor.getAttribute('alt');
    const itemLink = await ikeaCatalog.firstItemLink.getAttribute('href');
    console.log(itemLink);
    if (!itemLink) {
        throw new Error('Item link not found');
    }
    await page.goto(itemLink);
    const itemPage = new ikeaItem(page);
    await expect (itemPage.itemHeader).toBeVisible();
    const headerText = await itemPage.itemHeader.textContent();
    console.log(headerText);
    expect (altText).toEqual(headerText);
})
