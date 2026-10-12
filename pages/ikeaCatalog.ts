import { Page, Locator } from '@playwright/test';

export class ikeaCatalogPage {
  readonly page: Page;
  readonly itemsList: Locator;
  readonly itemsCountText: Locator;
  readonly itemsCountTable: Locator;
  readonly spanColor: Locator;
  readonly colorPickerFirst: Locator;
  readonly colorPickerFirstCount: Locator;
  readonly filterBar: Locator;
  readonly seriesNameFirst: Locator;
  readonly seriesHeader: Locator;
  readonly mammutTable: Locator;
  readonly itemHeading: Locator;
  readonly mammutTableText: Locator;
  readonly headerCount: Locator;

  readonly kidsCategory: Locator;
  readonly firstItemColor: Locator;
  readonly firstItemLink: Locator;

  readonly firstItem: Locator;
  readonly addFavoriteButton: Locator;
  readonly favoriteBanner: Locator;
  readonly openFavoriteButton: Locator;


    constructor(page: Page) {
    this.page = page;
    this.itemsList = page.getByTestId('plp-search-page-container');
    this.itemsCountText = page.getByRole('heading', {name: /מציג תוצאות עבור/}).locator('b');
    this.itemsCountTable = page.locator('#product-list').getByTestId('plp-product-card');
    this.spanColor = page.getByRole('button', {name: 'צבע'});
    this.colorPickerFirst = page.locator('.plp-color-filter__item').first();
    this.colorPickerFirstCount = this.colorPickerFirst.locator('span[aria-label]');
    this.filterBar = page.locator('.plp-applied-filters-bar');
    this.seriesNameFirst = page.locator('.listing-overflow-carousel__content').getByRole('listitem').first();
    this.seriesHeader = page.locator('.hnf-pageheader__wrapper').locator('h1');

    this.headerCount = page.locator('h1>b');
    this.mammutTable = page.getByRole('link', { name: /MAMMUT, שולחן ילדים, בבית\/מחוץ לבית לבן/ })
    .and(page.locator('.plp-price-module__product-link'));
    this.itemHeading = page.getByRole('heading', {level:3}).filter({has: this.mammutTable})
    this.mammutTableText = this.itemHeading.locator('.plp-price-module__description');

    this.kidsCategory = page.getByRole('link', {name: 'ילדים', exact: true});
    this.firstItemColor = page.getByTestId('plp-variant-box').first().locator('img').first();
    this.firstItemLink = page.getByTestId('plp-variant-box').first().locator('a').first();

    this.firstItem = page.getByTestId('plp-product-card').first().locator('img').first();
    this.addFavoriteButton = page.getByTestId('plp-product-card').first().locator('.plp-grid-product-card__favourite-button-wrapper');
    this.favoriteBanner = page.getByText(/נוסף לרשימת המועדפים שלך/);
    this.openFavoriteButton = page.getByRole('button', {name: 'תצוגה', exact: true});
  }
    

    async clickColorFilter() {
      await this.spanColor.click();
    }

    async scrollIntoColor(){
      await this.colorPickerFirst.scrollIntoViewIfNeeded();
    }

    async clickColorPicker(){
      await this.colorPickerFirst.click();
    }

    async scrollToFirstSeries(){
      await this.seriesNameFirst.scrollIntoViewIfNeeded();
    }

    async clickFirstSeries(){
      await this.seriesNameFirst.click();
    }

    async clickMammutTable(){
      await this.mammutTable.click();
    }

    async clickKidsButton(){
      await this.kidsCategory.click();
    }

    async scrollFirstItem(){
      await this.page.mouse.wheel(0, 2000);
      await this.page.mouse.wheel(0, 2000);
    }

    async clickFirstItem(){
      await this.firstItem.click();
    }

  async goto(){
    await this.page.goto('https://www.ikea.com/il/he/cat/children-bc003/');
  }

  async clickAddFavoriteButton(){
    await this.addFavoriteButton.click();
  }

  async clickOpenFavorite(){
    await this.openFavoriteButton.click();
  }

}