import { test, expect } from '@playwright/test';

// Basic end-to-end flow on Sauce Demo: login -> add to cart -> checkout
test.describe('Sauce Demo E2E', () => {
  test('standard user can complete a checkout', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify inventory page is visible
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

    // Add first two products to cart
    const addButtons = page.getByRole('button', { name: /Add to cart/i });
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    // Go to cart
    await page.getByRole('link', { name: /shopping cart/i }).click();
    await expect(page).toHaveURL(/.*cart\.html/);

    // Proceed to checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Fill checkout information
    await page.getByPlaceholder('First Name').fill('Jane');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip\/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Review and finish
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await page.getByRole('button', { name: 'Finish' }).click();

    // Confirmation
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });

  test('shows error on invalid login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Epic sadface:')).toBeVisible();
  });
});


