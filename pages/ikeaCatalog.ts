import { Page, Locator } from '@playwright/test';

export class ikeaCatalogPage {
  readonly page: Page;
  readonly itemsList: Locator;
  readonly itemsCountText: Locator;
  readonly itemsCountTable: Locator;
  readonly spanColor: Locator;
  readonly colorPickerPink: Locator;
  readonly filterBar: Locator;
  readonly listItemMammut: Locator;
  readonly mammutTable: Locator;
  readonly mammutHeading: Locator;
  readonly mammutTableText: Locator;
  readonly headerCount: Locator;

  readonly kidsCategory: Locator;
  readonly firstItemColor: Locator;
  readonly firstItemLink: Locator;


    constructor(page: Page) {
    this.page = page;
    this.itemsList = page.getByTestId('plp-search-page-container');
    this.itemsCountText = page.getByRole('heading', {name: /מציג תוצאות עבור/}).locator('b');
    this.itemsCountTable = page.locator('#product-list').getByTestId('plp-product-card');
    this.spanColor = page.getByRole('button', {name: 'צבע'});
    this.colorPickerPink = page.getByRole('checkbox', {name: /ורוד/});
    this.filterBar = page.locator('.plp-applied-filters-bar');
    this.listItemMammut = page.getByRole('listitem').getByText('MAMMUT');
    this.headerCount = page.locator('h1>b');
    this.mammutTable = page.getByRole('link', { name: /MAMMUT, שולחן ילדים, בבית\/מחוץ לבית לבן/ })
    .and(page.locator('.plp-price-module__product-link'));
    this.mammutHeading = page.getByRole('heading', {level:3}).filter({has: this.mammutTable})
    this.mammutTableText = this.mammutHeading.locator('.plp-price-module__description');

    this.kidsCategory = page.getByRole('link', {name: 'ילדים', exact: true});
    this.firstItemColor = page.getByTestId('plp-variant-box').first().locator('img').first();
    this.firstItemLink = page.getByTestId('plp-variant-box').first().locator('a').first();
  }
    

    async clickColorFilter() {
      await this.spanColor.click();
    }

    async scrollIntoPink(){
      await this.colorPickerPink.scrollIntoViewIfNeeded();
    }

    async clickColorPicker(){
      await this.colorPickerPink.click();
    }

    async scrollToListItemMammut(){
      await this.listItemMammut.scrollIntoViewIfNeeded();
    }

    async clickMammut(){
      await this.listItemMammut.click();
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

}