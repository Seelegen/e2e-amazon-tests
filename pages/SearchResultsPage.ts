import { Page, expect } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  readonly productSelector = '[data-component-type="s-search-result"] a[href*="/dp/"]';

  constructor(page: Page) {
    this.page = page;
  }

  async openFirstProduct() {
    const firstProduct = this.page.locator(this.productSelector).first();
    await firstProduct.click();
  }

  async verifySearchResultsVisible() {
    const results = this.page.locator('[data-component-type="s-search-result"]');
    await expect(results.first()).toBeVisible();
  }
}