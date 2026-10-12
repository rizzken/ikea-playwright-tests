import { test, expect } from '@playwright/test';
import { ikeaHomePage } from '../pages/ikeaHome';
import { ikeaCatalogPage } from '../pages/ikeaCatalog';
import {ikeaItem} from '../pages/ikeaItemPage'
import {ikeaFavoritePage} from '../pages/ikeaFavorite'

test.describe('search group',() => {

    test.beforeEach(async({page}) => {
        const homePage = new ikeaHomePage(page);
        await homePage.goto();
        await expect(page).toHaveTitle(/IKEA/);
        await homePage.acceptCookies();
    })

    test('search and filter', async({page}) => {            
        const homePage = new ikeaHomePage(page);
        await expect(homePage.ikeaLogo).toHaveAttribute('src', 'https://www.ikea.com/global/assets/logos/brand/ikea.svg');
        await expect(homePage.photoButton).toHaveAttribute('aria-hidden', 'false');
        await homePage.clickSearchInput();
        await expect(homePage.searchDialog).toBeVisible();
        const series = 'FLISAT';
        await homePage.fillSearchInput(series);
        await expect(homePage.searchButton).toHaveAttribute('aria-hidden', 'false');
        await homePage.clickSearchButton();
        const ikeaCatalog = new ikeaCatalogPage(page);
        await expect(ikeaCatalog.itemsList).toBeVisible();
        await expect(ikeaCatalog.headerCount).toBeVisible();
        const cardCount = await ikeaCatalog.itemsCountTable.count();
        const headerCount = await ikeaCatalog.headerCount.textContent();
        if (!cardCount) {
            throw new Error('There are no cards');
        }
         if (!headerCount) {
            throw new Error('The header is empty');
        }
        expect(cardCount).toEqual(Number(headerCount));
        await ikeaCatalog.clickColorFilter();
        await ikeaCatalog.scrollIntoColor();
        await expect(ikeaCatalog.colorPickerFirst).toBeVisible();
        const colorCount = await ikeaCatalog.colorPickerFirstCount.textContent();
        if (!colorCount) {
            throw new Error('Color count not found');
        }
        await ikeaCatalog.clickColorPicker();
        await expect(ikeaCatalog.itemsCountText).toHaveText(colorCount);
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
                className = await homePage.nextItemButton.getAttribute('class');
            }
        }
        await expect(homePage.kidsDD).toBeVisible();
        await homePage.clickkidsLink();

        const ikeaCatalog = new ikeaCatalogPage(page);
        await ikeaCatalog.scrollToFirstSeries();
        const seriesName = await ikeaCatalog.seriesNameFirst.textContent();
        if (!seriesName) {
            throw new Error('Series name not found');
        }
        await ikeaCatalog.clickFirstSeries();
        const seriesHeader = await ikeaCatalog.seriesHeader.textContent();
        if (!seriesHeader) {
            throw new Error('Series header not found');
        }
        expect(seriesHeader).toContain(seriesName);

        await ikeaCatalog.scrollFirstItem();
        const itemNameSearch = await ikeaCatalog.firstItem.getAttribute('alt');
        await ikeaCatalog.clickFirstItem();
        const itemPage = new ikeaItem(page);
        const itemPageText = await itemPage.content.textContent();
        if (!itemNameSearch || !itemPageText) {
            throw new Error('Item name not found');
        }
        expect(itemNameSearch).toContain(itemPageText);
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
        };
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
        };
        await page.goto(itemLink);
        const itemPage = new ikeaItem(page);
        await expect(itemPage.itemHeader).toBeVisible();
        const headerText = await itemPage.itemHeader.textContent();
        console.log(headerText);
        if (!altText || !headerText) { throw new Error('Item name not found') }
        expect(altText).toEqual(headerText);
    })
})

test('add to favorite', async({page}) => {
    const ikeaCatalog = new ikeaCatalogPage(page);
    await ikeaCatalog.goto();
    await expect(page).toHaveTitle(/ילדים/);
    const homePage = new ikeaHomePage(page);
    await homePage.acceptCookies();
    await ikeaCatalog.scrollFirstItem();
    await expect(ikeaCatalog.firstItem).toBeVisible();
    const altText = await ikeaCatalog.firstItem.getAttribute('alt');
    console.log(altText);
    await ikeaCatalog.clickAddFavoriteButton();
    await expect(ikeaCatalog.favoriteBanner).toBeVisible();
    await ikeaCatalog.clickOpenFavorite();
    const favoritePage = new ikeaFavoritePage(page);
    await expect(favoritePage.favoriteHeader).toBeVisible();
    await favoritePage.scrollToItem();
    const favoriteText = await favoritePage.firstFavoriteItem.getAttribute('alt');
    console.log(favoriteText);
    if (!altText || !favoriteText) { throw new Error('Item name not found') }
    expect(altText).toEqual(favoriteText);
})
