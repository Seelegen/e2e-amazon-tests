import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly cookieButton = 'input[name="accept"], span:has-text("Accepter"), input[type="submit"]:has-text("Accepter")';
  readonly searchBox = '#twotabsearchtextbox';
  readonly searchButton = '#nav-search-submit-button';
  readonly cartButton = '#nav-cart';

  constructor(page: Page) {
    this.page = page;
  }

  async acceptCookies() {
    try {
      const cookieLocator = this.page.locator(this.cookieButton);
      if (await cookieLocator.first().isVisible({ timeout: 3000 })) {
        await cookieLocator.first().click();
      }
    } catch {
      console.warn('⚠️ Aucun bouton de cookie détecté');
    }
  }

  async searchProduct(productName: string) {
    await this.page.locator(this.searchBox).fill(productName);
    await this.page.locator(this.searchButton).click();
  }

  async goToCart() {
    await this.page.locator(this.cartButton).click();
  }
}