import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';

const BASE_URL = 'https://www.amazon.fr';

test('Test 1 : Vérifier le chargement de la page Amazon', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle(/Amazon/i);
});

test('Test 2 : Vérifier l’acceptation des cookies', async ({ page }) => {
  const homePage = new HomePage(page);
  await page.goto(BASE_URL);
  await homePage.acceptCookies();
});

test('Test 3 : Effectuer une recherche "baskets"', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);

  await page.goto(BASE_URL);
  await homePage.acceptCookies();
  await homePage.searchProduct('baskets');
  await searchResultsPage.verifySearchResultsVisible();
});

test('Test 4 : Ouvrir la page d’un produit', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const productPage = new ProductPage(page);

  await page.goto(BASE_URL);
  await homePage.acceptCookies();
  await homePage.searchProduct('baskets');
  await searchResultsPage.openFirstProduct();
  await productPage.verifyProductPage();
});

test('Test 5 : Accéder au panier', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.goto(BASE_URL);
  await homePage.acceptCookies();
  await homePage.goToCart();
  await expect(page).toHaveURL(/gp\/cart/);
});

test('Test 6 : Ajouter un produit au panier', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const productPage = new ProductPage(page);

  await page.goto(BASE_URL);
  await homePage.acceptCookies();
  await homePage.searchProduct('ballon de foot');

  await searchResultsPage.openFirstProduct();

  await productPage.addToCart();

  await productPage.verifyProductAddedToCart();
});

test('Test 7 : Vérifier le processus de paiement', async ({ page }) => {
  const homePage = new HomePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  const productPage = new ProductPage(page);

  await page.goto(BASE_URL);
  await homePage.acceptCookies();
  await homePage.searchProduct('ballon de foot');
  await searchResultsPage.openFirstProduct();
  await productPage.addToCart();

  await homePage.goToCart();
  await expect(page).toHaveURL(/gp\/cart/);

  const checkoutButton = page.locator('input[name="proceedToRetailCheckout"]');
  await checkoutButton.click();

  await expect(page).toHaveURL(/ap\/signin/);
  const loginForm = page.locator('form[name="signIn"]');
  await expect(loginForm).toBeVisible();
});