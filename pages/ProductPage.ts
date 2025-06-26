import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton = '#add-to-cart-button';
  readonly cartConfirmationMessage = '#huc-v2-order-row-confirm-text';

  constructor(page: Page) {
    this.page = page;
  }

  async verifyProductPage() {
    await expect(this.page).toHaveURL(/\/dp\//);
  }

  async addToCart() {
    await this.page.locator(this.addToCartButton).click();
  }

  async verifyProductAddedToCart() {
    const confirmationMessage = this.page.locator('#NATC_SMART_WAGON_CONF_MSG_SUCCESS i');
    await this.page.waitForSelector('#NATC_SMART_WAGON_CONF_MSG_SUCCESS i', { timeout: 15000 });
    await expect(confirmationMessage).toBeVisible();
  }
}