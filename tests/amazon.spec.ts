const { test, expect } = require('@playwright/test');
 
const BASE_URL = 'https://www.amazon.fr/';
// All tests are for amazon.fr
 
// Test case 1 : Verify navigation to amazon.fr
test('Verify navigation to amazon.fr', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' }); 
    const url = page.url();
    expect(url).toContain('amazon.fr');
});
 
// Test case 2 : Verify cookie acceptance
test('Test case 2 : Verify cookie acceptance', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  
    // Sélectionne dynamiquement le bouton "Accepter les cookies"
    const cookieButton = page.locator('input[name="accept"], input[data-cel-widget*="sp-cc"], span:has-text("Accepter")');
  
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
  
      // Attendre un court instant que le DOM se mette à jour
      await page.waitForTimeout(1000);
  
      // Vérifie que le bouton n'est plus visible
      await expect(cookieButton).toBeHidden();
    } else {
      console.warn('⚠️ Aucun bouton cookie visible');
    }
  });

// Test case 3 : Verify product search
test('Test case 3 : Verify product search', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

  // Gérer le pop-up de cookies si présent
  const acceptBtn = page.locator('input[name="accept"], input[data-cel-widget*="sp-cc"]');
  if (await acceptBtn.isVisible()) await acceptBtn.click();

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  const results = page.locator('div.s-main-slot');
  await expect(results).toBeVisible();
});

// Test case 4 : Verify selection of the first product
test('Test case 4 : Verify selection of the first product', async ({ page }) => {
  await page.goto(BASE_URL);
  const acceptBtn = page.locator('input[name="accept"], input[data-cel-widget*="sp-cc"]');
  if (await acceptBtn.isVisible()) await acceptBtn.click();

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  await page.waitForSelector('div.s-main-slot');
  const firstProduct = page.locator('div.s-main-slot a[href*="/dp/"]').first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();

  await expect(page.locator('#productTitle')).toBeVisible();
});

// Test case 5 : Verify adding product to cart
test('Test case 5 : Verify adding product to cart', async ({ page }) => {
  await page.goto(BASE_URL);
  const acceptBtn = page.locator('input[name="accept"], input[data-cel-widget*="sp-cc"]');
  if (await acceptBtn.isVisible()) await acceptBtn.click();

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  await page.locator('div.s-main-slot a[href*="/dp/"]').first().click();

  const addBtn = page.locator('#add-to-cart-button');
  await expect(addBtn).toBeVisible();
  await addBtn.click();

  const confirm = page.locator('#sw-gtc, #attachDisplayAddBaseAlert');
  await expect(confirm).toBeVisible();
});

// Test case 6 : Verify accessing the cart
test('Test case 6 : Verify accessing the cart', async ({ page }) => {
  await page.goto(BASE_URL);
  const acceptBtn = page.locator('input[name="accept"], input[data-cel-widget*="sp-cc"]');
  if (await acceptBtn.isVisible()) await acceptBtn.click();

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  await page.locator('div.s-main-slot a[href*="/dp/"]').first().click();
  await page.locator('#add-to-cart-button').click();

  // Attendre l'apparition de la confirmation panier (overlay ou bouton)
  await page.waitForSelector('#sw-gtc, #attach-sidesheet-view-cart-button', { timeout: 10000 });
  
  // Cliquer sur "Voir le panier" via le bon bouton
  const viewCart = page.locator('#sw-gtc, #attach-sidesheet-view-cart-button').first();
  await viewCart.click();  

  const cartItem = page.locator('.sc-list-item-content');
  await expect(cartItem.first()).toBeVisible();
});

// Test case 7 : Verify the checkout process
test('Test case 7 : Verify the checkout process', async ({ page }) => {
  await page.goto(BASE_URL);
  const acceptBtn = page.locator('input[name="accept"], input[data-cel-widget*="sp-cc"]');
  if (await acceptBtn.isVisible()) await acceptBtn.click();

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  await page.locator('div.s-main-slot a[href*="/dp/"]').first().click();
  await page.locator('#add-to-cart-button').click();

    // Attendre l'apparition de la confirmation panier (overlay ou bouton)
    await page.waitForSelector('#sw-gtc, #attach-sidesheet-view-cart-button', { timeout: 10000 });

    // Cliquer sur "Voir le panier" via le bon bouton
    const viewCart = page.locator('#sw-gtc, #attach-sidesheet-view-cart-button').first();
    await viewCart.click();


  const proceed = page.locator('input[name="proceedToRetailCheckout"]');
  await expect(proceed).toBeVisible();
  await proceed.click();

  await expect(page).toHaveURL(/.*\/signin|.*\/checkout/);
});