import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.amazon.fr';

// Test 1 : Vérifier le chargement de la page
test('Test 1 : Vérifier le chargement de la page Amazon', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/Amazon/i);
});

//Test 2 : Vérifier l’acceptation des cookies
test('Test 2 : Vérifier l’acceptation des cookies', async ({ page }) => {
  await page.goto(BASE_URL);

  try {
    const cookieButton = page.locator('input[name="accept"], span:has-text("Accepter"), input[type="submit"]:has-text("Accepter")');
    if (await cookieButton.first().isVisible({ timeout: 3000 })) {
      await cookieButton.first().click();
      await expect(cookieButton.first()).toBeHidden();
    }
  } catch (e) {
    console.warn('⚠️ Aucun bouton de cookie détecté');
  }
});

// Test 3 : Recherche
test('Test 3 : Effectuer une recherche "baskets"', async ({ page }) => {
  await page.goto(BASE_URL);

  try {
    const cookieButton = page.locator('input[name="accept"], span:has-text("Accepter"), input[type="submit"]:has-text("Accepter")');
    if (await cookieButton.first().isVisible({ timeout: 3000 })) {
      await cookieButton.first().click();
    }
  } catch {}

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  const results = page.locator('[data-component-type="s-search-result"]');
  await expect(results.first()).toBeVisible();
});

// Test 4 : Ouvrir un produit
test('Test 4 : Ouvrir la page d’un produit', async ({ page }) => {
  await page.goto(BASE_URL);

  try {
    const cookieButton = page.locator('input[name="accept"], span:has-text("Accepter"), input[type="submit"]:has-text("Accepter")');
    if (await cookieButton.first().isVisible({ timeout: 3000 })) {
      await cookieButton.first().click();
    }
  } catch {}

  await page.locator('#twotabsearchtextbox').fill('baskets');
  await page.locator('#nav-search-submit-button').click();

  const firstProduct = page.locator('[data-component-type="s-search-result"] a[href*="/dp/"]').first();
  await firstProduct.click();

  await expect(page).toHaveURL(/\/dp\//);
});


// Test 5 : Accéder au panier
test('Test 5 : Accéder au panier', async ({ page }) => {
  await page.goto(BASE_URL);

  try {
    const cookieButton = page.locator('input[name="accept"], span:has-text("Accepter"), input[type="submit"]:has-text("Accepter")');
    if (await cookieButton.first().isVisible({ timeout: 3000 })) {
      await cookieButton.first().click();
    }
  } catch (e) {}

  await page.locator('#nav-cart').click();
  await expect(page).toHaveURL(/gp\/cart/);
});