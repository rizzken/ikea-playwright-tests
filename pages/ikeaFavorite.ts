import { Page, Locator } from '@playwright/test';

export class ikeaFavoritePage {
    readonly page: Page;
    readonly favoriteHeader: Locator;
    readonly firstFavoriteItem: Locator;

        constructor(page: Page) {
        this.page = page;
        this.favoriteHeader = page.getByText('מועדפים');
        this.firstFavoriteItem = page.getByTestId('list-product').first().locator('img');
        }

    async scrollToItem(){
      await this.firstFavoriteItem.scrollIntoViewIfNeeded();
    }

}