import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyProductPage() {
    await expect(this.page).toHaveURL(/\/dp\//);
  }
}