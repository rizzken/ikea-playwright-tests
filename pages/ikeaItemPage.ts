import { Page, Locator } from '@playwright/test';

export class ikeaItem {
  readonly page: Page;
  readonly content: Locator;
  readonly itemHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.content = page.locator('#content').locator('.pipcom-text.pipcom-typography-label-l.pipcom-typography-regular.pipcom-price-module__description');
    this.itemHeader = page.locator('h1');
  }

}