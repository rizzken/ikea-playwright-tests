import { Page, Locator } from '@playwright/test';

export class ikeaHomePage {
  readonly page: Page;
  readonly ikeaLogo: Locator;
  readonly acceptCookie: Locator
  readonly searchInput: Locator;
  readonly searchDialog: Locator;
  readonly photoButton: Locator;
  readonly searchButton: Locator;

  readonly homeItems: Locator;
  readonly catalogNavigation: Locator;
  readonly nextItemButton: Locator;
  readonly tabKids: Locator;
  readonly kidsDD: Locator;
  readonly kidsLink: Locator;

  readonly firstItemInCategories: Locator;
  readonly nextCategoryButton: Locator;
  readonly kidsCategoryScroll: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ikeaLogo = page.getByRole('link', {name: /לוגו של איקאה/}).locator('img');
    this.acceptCookie = page.locator("#onetrust-accept-btn-handler");
    this.searchInput = page.getByRole('combobox', {name: /חיפוש מוצרים/});
    this.searchDialog = page.locator('.search-box-dropdown');
    this.photoButton = page.getByRole('button', {name: /לפי תמונה/});
    this.searchButton = page.getByRole('button', {name: 'חיפוש', exact:true});
    
    this.homeItems = page.getByRole('button', {name: 'מוצרים'});
    this.catalogNavigation = page.getByRole('navigation', {name: 'מוצרים', exact: true});
    this.nextItemButton = page.getByRole('button', {name: 'See next items'});
    this.tabKids = page.getByRole('tab', {name: 'תינוקות וילדים'});
    this.kidsDD = page.locator('.hnf-menu__category-content');
    this.kidsLink = page.getByRole('link', {name: 'ילדים', exact: true});

    this.firstItemInCategories = page.locator('.hnf-carousel-slide').first();
    this.nextCategoryButton = page.getByRole('button', {name: 'הצגת הפריטים הבאים', exact: true});
    this.kidsCategoryScroll = page.locator('a[href="https://www.ikea.com/il/he/cat/baby-children-bc001/"]');
  }

  async goto(){
    await this.page.goto('https://www.ikea.com/il/he/');
  }

  async acceptCookies() {
    await this.acceptCookie.click();
  }

  async clickSearchInput() {
    await this.searchInput.click();
  }

  async fillSearchInput(text: string){
    await this.searchInput.fill(text);
  }

  async clickSearchButton() {
    await this.searchButton.click();
  }

  async clickItems(){
    await this.homeItems.click();
  }

  async clicknextItemButton(){
    await this.nextItemButton.click();
  }

  async clickTabKids(){
    await this.tabKids.click();
  }

  async clickkidsLink(){
    await this.kidsLink.click();
  }

  async hoverFirstItem(){
    await this.firstItemInCategories.hover();
  }
  
  async clickNextCategoryButton(){
    await this.nextCategoryButton.click();
  }

  async clickKidsCategory(){
    await this.kidsCategoryScroll.click();
  }
}

